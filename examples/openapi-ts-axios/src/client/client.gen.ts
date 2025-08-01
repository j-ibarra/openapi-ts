// This file is auto-generated by @hey-api/openapi-ts

import {
  type ClientOptions as DefaultClientOptions,
  type Config,
  createClient,
  createConfig,
} from './client';
import type { ClientOptions } from './types.gen';

/**
 * The `createClientConfig()` function will be called on client initialization
 * and the returned object will become the client's initial configuration.
 *
 * You may want to initialize your client this way instead of calling
 * `setConfig()`. This is useful for example if you're using Next.js
 * to ensure your client always has the correct values.
 */
export type CreateClientConfig<T extends DefaultClientOptions = ClientOptions> =
  (
    override?: Config<DefaultClientOptions & T>,
  ) => Config<Required<DefaultClientOptions> & T>;

export const client = createClient(
  createConfig<ClientOptions>({
    baseURL: 'https://petstore3.swagger.io/api/v3',
  }),
);
