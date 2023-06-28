import {
  calcLineLength,
  help,
  lineToString,
  outputArrayToString,
} from '../../../src/commands/help';
import { deployCommand } from '../../../src/commands/deploy/command';

import chalk from 'chalk';

describe('help command', () => {
  describe('calcLineLength', () => {
    test.each([
      {
        name: 'without ansi',
        line: ['a line without ansi'],
        expectedLength: 19,
      },
      {
        name: 'with ansi',
        line: [`a line with ${chalk.red('ansi')}`],
        expectedLength: 16,
      },
    ])(
      'should calculate the correct line length $name',
      ({ line, expectedLength }) => {
        expect(calcLineLength(line)).toBe(expectedLength);
      }
    );
  });

  describe('lineToString', () => {
    test.each([
      {
        line: ['a', 'b', 'c'],
        expected: 'a b c',
      },
      {
        line: [' ', 'a', ' ', 'b', ' ', 'c', ' '],
        expected: ' a b c ',
      },
      {
        line: [' ', '  ', '   '],
        expected: '      ',
      },
      {
        line: ['a', '  ', '   ', 'b', 'c'],
        expected: 'a     b c',
      },
    ])(
      'should insert spaces between non-whitespace items only; $line',
      ({ line, expected }) => {
        expect(lineToString(line)).toBe(expected);
      }
    );
  });

  describe('outputArrayToString', () => {
    test('should join a list of strings using newlines', () => {
      expect(outputArrayToString(['line 1', 'line 2', 'line 3'])).toBe(
        'line 1\nline 2\nline 3'
      );
    });
  });

  test('help', () => {
    expect(help(deployCommand)).toMatchInlineSnapshot(`
      "▲ [1mvercel[22m [1mdeploy[22m [project-path] [options]

      Deploy your project to Vercel. The \`deploy\` command is the default command for the Vercel CLI, and can be omitted (\`vc deploy my-app\` equals \`vc my-app\`).

      [2mOptions:[22m

        --archive                    Compress the deployment code into a file before uploading it

        -b, --build-env <key=value>  Specify environment variables during build-time (e.g. \`-b KEY1=value1 -b KEY2=value2\`)

        -e, --env <key=value>        Specify environment variables during run-time (e.g. \`-e KEY1=value1 -e KEY2=value2\`)

        -f, --force                  Force a new deployment even if nothing has changed

        -m, --meta <key=value>       Specify metadata for the deployment (e.g. \`-m KEY1=value1 -m KEY2=value2\`)

        --no-wait                    Don't wait for the deployment to finish

        --prebuilt                   Use in combination with \`vc build\`. Deploy an existing build

        --prod                       Create a production deployment

        -p, --public                 Deployment is public (\`/_src\`) is exposed)

        --regions                    Set default regions to enable the deployment on

        --with-cache                 Retain build cache when using "--force"

        -y, --yes                    Use default options to skip all prompts

      [2mExamples:[22m

        [90m-[39m Deploy the current directory

          [36m$ vercel[39m

        [90m-[39m Deploy a custom path

          [36m$ vercel /usr/src/project[39m

        [90m-[39m Deploy with run-time Environment Variables

          [36m$ vercel -e NODE_ENV=production[39m

        [90m-[39m Deploy with prebuilt outputs

          [36m$ vercel build[39m
          [36m$ vercel deploy --prebuilt[39m

        [90m-[39m Write Deployment URL to a file

          [36m$ vercel > deployment-url.txt[39m"
    `);
  });
});