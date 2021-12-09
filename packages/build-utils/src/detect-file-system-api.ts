import semver from 'semver';
import { isOfficialRuntime } from './';
import type {
  Builder,
  BuilderFunctions,
  Files,
  PackageJson,
  ProjectSettings,
} from './types';

const enableFileSystemApiFrameworks = new Set(['solidstart']);

/**
 * If the Deployment can be built with the new File System API,
 * we'll return the new Builder here, otherwise return `null`.
 */
export async function detectFileSystemAPI({
  files,
  projectSettings,
  builders,
  vercelConfig,
  pkg,
  tag,
  enableFlag = false,
}: {
  files: Files;
  projectSettings: ProjectSettings;
  builders: Builder[];
  vercelConfig:
    | { builds?: Builder[]; functions?: BuilderFunctions }
    | null
    | undefined;
  pkg: PackageJson | null | undefined;
  tag: string | undefined;
  enableFlag: boolean | undefined;
}): Promise<
  | { fsApiBuilder: Builder; reason: null }
  | { fsApiBuilder: null; reason: string }
> {
  const framework = projectSettings.framework || '';
  const hasDotOutput = Object.keys(files).some(file =>
    file.startsWith('.output/')
  );
  const hasMiddleware = Boolean(
    files['_middleware.js'] || files['_middleware.ts']
  );

  const isEnabled =
    enableFlag ||
    hasMiddleware ||
    hasDotOutput ||
    enableFileSystemApiFrameworks.has(framework);
  if (!isEnabled) {
    return { fsApiBuilder: null, reason: 'Flag not enabled.' };
  }

  if (vercelConfig?.builds && vercelConfig.builds.length > 0) {
    return {
      fsApiBuilder: null,
      reason:
        'Detected `builds` in vercel.json. Please remove it in favor of CLI plugins.',
    };
  }

  if (process.env.HUGO_VERSION) {
    return {
      fsApiBuilder: null,
      reason: 'Detected `HUGO_VERSION` environment variable. Please remove it.',
    };
  }
  if (process.env.ZOLA_VERSION) {
    return {
      fsApiBuilder: null,
      reason: 'Detected `ZOLA_VERSION` environment variable. Please remove it.',
    };
  }
  if (process.env.GUTENBERG_VERSION) {
    return {
      fsApiBuilder: null,
      reason:
        'Detected `GUTENBERG_VERSION` environment variable. Please remove it.',
    };
  }

  if (Object.values(vercelConfig?.functions || {}).some(fn => !!fn.runtime)) {
    return {
      fsApiBuilder: null,
      reason:
        'Detected `functions.runtime` in vercel.json. Please remove it in favor of CLI plugins.',
    };
  }

  const deps = Object.assign({}, pkg?.dependencies, pkg?.devDependencies);
  const invalidBuilder = builders.find(({ use }) => {
    const valid =
      isOfficialRuntime('go', use) ||
      isOfficialRuntime('python', use) ||
      isOfficialRuntime('ruby', use) ||
      isOfficialRuntime('node', use) ||
      isOfficialRuntime('next', use) ||
      isOfficialRuntime('static', use) ||
      isOfficialRuntime('static-build', use);
    return !valid;
  });

  if (invalidBuilder) {
    return {
      fsApiBuilder: null,
      reason: `Detected \`${invalidBuilder.use}\` in vercel.json. Please remove it in favor of CLI plugins.`,
    };
  }

  for (const lang of ['go', 'python', 'ruby']) {
    for (const { use } of builders) {
      const plugin = 'vercel-plugin-' + lang;
      if (isOfficialRuntime(lang, use) && !deps[plugin]) {
        return {
          fsApiBuilder: null,
          reason: `Detected \`${lang}\` Serverless Function usage without plugin \`${plugin}\`. Please run \`npm i ${plugin}\`.`,
        };
      }
    }
  }

  if (
    framework === 'nuxtjs' ||
    framework === 'sveltekit' ||
    framework === 'redwoodjs'
  ) {
    return {
      fsApiBuilder: null,
      reason: `Detected framework \`${framework}\` that only supports legacy File System API. Please contact the framework author.`,
    };
  }

  if (framework === 'nextjs' && !hasDotOutput) {
    // Use the old pipeline if a custom output directory was specified for Next.js
    // because `vercel build` cannot ensure that the directory will be in the same
    // location as `.output`, which can break imports (not just nft.json files).
    if (projectSettings?.outputDirectory) {
      return {
        fsApiBuilder: null,
        reason: `Detected Next.js with Output Directory \`${projectSettings?.outputDirectory}\` override. Please change it back to the default.`,
      };
    }
    const versionRange = deps['next'];
    if (!versionRange) {
      return {
        fsApiBuilder: null,
        reason: `Detected Next.js in Project Settings but missing \`next\` package.json dependencies. Please run \`npm i next\`.`,
      };
    }

    // TODO: We'll need to check the lockfile if one is present.
    if (versionRange !== 'latest' && versionRange !== 'canary') {
      const fixedVersion = semver.valid(semver.coerce(versionRange) || '');

      if (!fixedVersion || !semver.gte(fixedVersion, '12.0.0')) {
        return {
          fsApiBuilder: null,
          reason: `Detected old Next.js version ${versionRange}. Please run \`npm i next@latest\` to upgrade.`,
        };
      }
    }
  }

  const frontendBuilder = builders.find(
    ({ use }) =>
      isOfficialRuntime('next', use) ||
      isOfficialRuntime('static', use) ||
      isOfficialRuntime('static-build', use)
  );
  const config = frontendBuilder?.config || {};
  const withTag = tag ? `@${tag}` : '';

  const fsApiBuilder = {
    use: `@vercelruntimes/file-system-api${withTag}`,
    src: '**',
    config: {
      ...config,
      fileSystemAPI: true,
      framework: config.framework || framework || null,
      projectSettings,
      hasMiddleware,
      hasDotOutput,
    },
  };
  return { reason: null, fsApiBuilder };
}
