/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from 'zod';

export function constDateTime(
  val: string
): z.ZodType<string, z.ZodTypeDef, unknown> {
  return z.custom<string>(v => {
    return (
      typeof v === 'string' && new Date(v).getTime() === new Date(val).getTime()
    );
  }, `Value must be equivelant to ${val}`);
}
