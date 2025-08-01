// This file is auto-generated by @hey-api/openapi-ts

import { z } from 'zod/v4';

export const zFoo = z.object({
    bar: z.optional(z.int()),
    foo: z.coerce.bigint().default(BigInt(0)),
    id: z.string()
});

export const zBar = z.object({
    foo: z.int()
});

export const zPostFooData = z.object({
    body: z.optional(z.never()),
    path: z.optional(z.never()),
    query: z.optional(z.never())
});

/**
 * OK
 */
export const zPostFooResponse = zFoo;