/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from 'zod';

export type RemoveRecordRequest = {
  domain: string;
  recordId: string;
  /**
   * The Team identifier to perform the request on behalf of.
   */
  teamId?: string | undefined;
  /**
   * The Team slug to perform the request on behalf of.
   */
  slug?: string | undefined;
};

/**
 * Successful response by removing the specified DNS record.
 */
export type RemoveRecordResponseBody = {};

/** @internal */
export const RemoveRecordRequest$inboundSchema: z.ZodType<
  RemoveRecordRequest,
  z.ZodTypeDef,
  unknown
> = z.object({
  domain: z.string(),
  recordId: z.string(),
  teamId: z.string().optional(),
  slug: z.string().optional(),
});

/** @internal */
export type RemoveRecordRequest$Outbound = {
  domain: string;
  recordId: string;
  teamId?: string | undefined;
  slug?: string | undefined;
};

/** @internal */
export const RemoveRecordRequest$outboundSchema: z.ZodType<
  RemoveRecordRequest$Outbound,
  z.ZodTypeDef,
  RemoveRecordRequest
> = z.object({
  domain: z.string(),
  recordId: z.string(),
  teamId: z.string().optional(),
  slug: z.string().optional(),
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace RemoveRecordRequest$ {
  /** @deprecated use `RemoveRecordRequest$inboundSchema` instead. */
  export const inboundSchema = RemoveRecordRequest$inboundSchema;
  /** @deprecated use `RemoveRecordRequest$outboundSchema` instead. */
  export const outboundSchema = RemoveRecordRequest$outboundSchema;
  /** @deprecated use `RemoveRecordRequest$Outbound` instead. */
  export type Outbound = RemoveRecordRequest$Outbound;
}

/** @internal */
export const RemoveRecordResponseBody$inboundSchema: z.ZodType<
  RemoveRecordResponseBody,
  z.ZodTypeDef,
  unknown
> = z.object({});

/** @internal */
export type RemoveRecordResponseBody$Outbound = {};

/** @internal */
export const RemoveRecordResponseBody$outboundSchema: z.ZodType<
  RemoveRecordResponseBody$Outbound,
  z.ZodTypeDef,
  RemoveRecordResponseBody
> = z.object({});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace RemoveRecordResponseBody$ {
  /** @deprecated use `RemoveRecordResponseBody$inboundSchema` instead. */
  export const inboundSchema = RemoveRecordResponseBody$inboundSchema;
  /** @deprecated use `RemoveRecordResponseBody$outboundSchema` instead. */
  export const outboundSchema = RemoveRecordResponseBody$outboundSchema;
  /** @deprecated use `RemoveRecordResponseBody$Outbound` instead. */
  export type Outbound = RemoveRecordResponseBody$Outbound;
}
