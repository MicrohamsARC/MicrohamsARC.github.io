/**
 * Type declarations for eslint-plugin-jsx-a11y
 * This package doesn't ship its own types
 */
declare module 'eslint-plugin-jsx-a11y' {
  import type { ESLint, Linter } from 'eslint';

  const plugin: ESLint.Plugin & {
    flatConfigs: {
      recommended: Linter.Config;
      strict: Linter.Config;
    };
  };

  export default plugin;
}
