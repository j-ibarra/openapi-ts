---
title: Custom Plugin
description: Learn how to create your own Hey API plugin.
---

# Custom Plugin

::: warning
Plugin API is in development. The interface might change before it becomes stable. We encourage you to leave feedback on [GitHub](https://github.com/hey-api/openapi-ts/issues).
:::

You may need to write your own plugin if the available plugins do not suit your needs or you're working on a proprietary use case. This can be easily achieved using the Plugin API. But don't take our word for it – all Hey API plugins are written this way!

## File Structure

We recommend following the design pattern of the native plugins. You can browse the code on [GitHub](https://github.com/hey-api/openapi-ts/tree/main/packages/openapi-ts/src/plugins) as you follow this tutorial. First, create a `my-plugin` folder for your plugin files. Inside, create a barrel file `index.ts` exporting the plugin.

::: code-group

```ts [index.ts]
export { defaultConfig, defineConfig } from './config';
export type { MyPlugin } from './types';
```

:::

## TypeScript

`index.ts` references two files, so we need to create them. `types.d.ts` contains the TypeScript interface for your plugin options. It must have the reserved `name` and `output` fields, everything else will become user-configurable options.

::: code-group

```ts [types.d.ts]
import type { DefinePlugin } from '@hey-api/openapi-ts';

export type UserConfig = {
  /**
   * Plugin name. Must be unique.
   */
  name: 'my-plugin';
  /**
   * Name of the generated file.
   *
   * @default 'my-plugin'
   */
  output?: string;
  /**
   * User-configurable option for your plugin.
   *
   * @default false
   */
  myOption?: boolean;
};

export type MyPlugin = DefinePlugin<UserConfig>;
```

:::

## Configuration

`config.ts` contains the runtime configuration for your plugin. It must implement the `MyPlugin` interface we created above and define the `handler()` function from the `MyPlugin['Config']` interface.

::: code-group

```ts [config.ts]
import { definePluginConfig } from '@hey-api/openapi-ts';

import { handler } from './plugin';
import type { MyPlugin } from './types';

export const defaultConfig: MyPlugin['Config'] = {
  config: {
    myOption: false, // implements default value from types
  },
  dependencies: ['@hey-api/typescript'],
  handler,
  name: 'my-plugin',
  output: 'my-plugin',
};

/**
 * Type helper for `my-plugin` plugin, returns {@link Plugin.Config} object
 */
export const defineConfig = definePluginConfig(defaultConfig);
```

:::

In the file above, we define a `my-plugin` plugin which will generate a `my-plugin.gen.ts` file. We also demonstrate declaring `@hey-api/typescript` as a dependency for our plugin, so we can safely import artifacts from `types.gen.ts`.

By default, your plugin output won't be re-exported from the `index.ts` file. To enable this feature, add `exportFromIndex: true` to your `config.ts` file.

::: warning
Re-exporting your plugin from index file may result in broken output due to naming conflicts. Ensure your exported identifiers are unique.
:::

## Handler

Notice we defined `handler` in our `config.ts` file. This method is responsible for generating the actual output. We recommend implementing it in `plugin.ts`.

::: code-group

```ts [plugin.ts]
import type { MyPlugin } from './types';

export const handler: MyPlugin['Handler'] = ({ plugin }) => {
  // create an output file. it will not be
  // generated until it contains nodes
  const file = plugin.createFile({
    id: plugin.name,
    path: plugin.output,
  });

  plugin.forEach('operation', 'schema', (event) => {
    if (event.type === 'operation') {
      // do something with the operation model
    } else if (event.type === 'schema') {
      // do something with the schema model
    }
  });

  // we're using the TypeScript Compiler API
  const stringLiteral = ts.factory.createStringLiteral('Hello, world!');
  const variableDeclaration = ts.factory.createVariableDeclaration(
    'foo',
    undefined,
    undefined,
    stringLiteral,
  );
  const node = ts.factory.createVariableStatement(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createVariableDeclarationList(
      [variableDeclaration],
      ts.NodeFlags.Const,
    ),
  );

  // add a node to our file
  file.add(node);
};
```

:::

### Legacy Handler

You can also define an optional `handlerLegacy` function in `config.ts`. This method is responsible for generating the output when using the legacy parser. We do not recommend implementing this method unless you must use the legacy parser. You can use one of our [`plugin-legacy.ts`](https://github.com/hey-api/openapi-ts/blob/main/packages/openapi-ts/src/plugins/%40hey-api/typescript/plugin-legacy.ts) files as an inspiration for potential implementation.

## Usage

Once we're satisfied with our plugin, we can register it in the [configuration](/openapi-ts/configuration) file.

```js
import { defineConfig } from 'path/to/my-plugin';

export default {
  input: 'https://get.heyapi.dev/hey-api/backend',
  output: 'src/client',
  plugins: [
    defineConfig({
      myOption: true,
    }),
  ],
};
```

## Output

Putting all of this together will generate the following `my-plugin.gen.ts` file.

::: code-group

```ts [my-plugin.gen.ts]
export const foo = 'Hello, world!';
```

:::

Congratulations! You've successfully created your own plugin! :tada:

<!--@include: ../../partials/examples.md-->
<!--@include: ../../partials/sponsors.md-->
