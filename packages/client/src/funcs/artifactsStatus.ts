/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import { VercelCore } from '../core.js';
import { encodeFormQuery as encodeFormQuery$ } from '../lib/encodings.js';
import * as m$ from '../lib/matchers.js';
import * as schemas$ from '../lib/schemas.js';
import { RequestOptions } from '../lib/sdks.js';
import { extractSecurity, resolveGlobalSecurity } from '../lib/security.js';
import { pathToFunc } from '../lib/url.js';
import {
  ConnectionError,
  InvalidRequestError,
  RequestAbortedError,
  RequestTimeoutError,
  UnexpectedClientError,
} from '../models/errors/httpclienterrors.js';
import { SDKError } from '../models/errors/sdkerror.js';
import { SDKValidationError } from '../models/errors/sdkvalidationerror.js';
import * as operations from '../models/operations/index.js';
import { Result } from '../types/fp.js';

/**
 * Get status of Remote Caching for this principal
 *
 * @remarks
 * Check the status of Remote Caching for this principal. Returns a JSON-encoded status indicating if Remote Caching is enabled, disabled, or disabled due to usage limits.
 */
export async function artifactsStatus(
  client$: VercelCore,
  request: operations.StatusRequest,
  options?: RequestOptions
): Promise<
  Result<
    operations.StatusResponseBody,
    | SDKError
    | SDKValidationError
    | UnexpectedClientError
    | InvalidRequestError
    | RequestAbortedError
    | RequestTimeoutError
    | ConnectionError
  >
> {
  const input$ = typeof request === 'undefined' ? {} : request;

  const parsed$ = schemas$.safeParse(
    input$,
    value$ => operations.StatusRequest$outboundSchema.parse(value$),
    'Input validation failed'
  );
  if (!parsed$.ok) {
    return parsed$;
  }
  const payload$ = parsed$.value;
  const body$ = null;

  const path$ = pathToFunc('/v8/artifacts/status')();

  const query$ = encodeFormQuery$({
    slug: payload$.slug,
    teamId: payload$.teamId,
  });

  const headers$ = new Headers({
    Accept: 'application/json',
  });

  const bearerToken$ = await extractSecurity(client$.options$.bearerToken);
  const security$ = bearerToken$ == null ? {} : { bearerToken: bearerToken$ };
  const context = {
    operationID: 'status',
    oAuth2Scopes: [],
    securitySource: client$.options$.bearerToken,
  };
  const securitySettings$ = resolveGlobalSecurity(security$);

  const requestRes = client$.createRequest$(
    context,
    {
      security: securitySettings$,
      method: 'GET',
      path: path$,
      headers: headers$,
      query: query$,
      body: body$,
      timeoutMs: options?.timeoutMs || client$.options$.timeoutMs || -1,
    },
    options
  );
  if (!requestRes.ok) {
    return requestRes;
  }
  const request$ = requestRes.value;

  const doResult = await client$.do$(request$, {
    context,
    errorCodes: ['400', '401', '402', '403', '4XX', '5XX'],
    retryConfig: options?.retries || client$.options$.retryConfig,
    retryCodes: options?.retryCodes || ['429', '500', '502', '503', '504'],
  });
  if (!doResult.ok) {
    return doResult;
  }
  const response = doResult.value;

  const [result$] = await m$.match<
    operations.StatusResponseBody,
    | SDKError
    | SDKValidationError
    | UnexpectedClientError
    | InvalidRequestError
    | RequestAbortedError
    | RequestTimeoutError
    | ConnectionError
  >(
    m$.json(200, operations.StatusResponseBody$inboundSchema),
    m$.fail([400, 401, 402, 403, '4XX', '5XX'])
  )(response);
  if (!result$.ok) {
    return result$;
  }

  return result$;
}
