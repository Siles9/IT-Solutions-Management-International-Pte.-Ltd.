import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

/**
 * NestJS DI relies on `emitDecoratorMetadata`, which esbuild does not emit.
 * SWC does, so the test runner sees the same metadata as the production build.
 */
export default defineConfig({
  plugins: [
    swc.vite({
      jsc: {
        target: 'es2022',
        parser: { syntax: 'typescript', decorators: true },
        transform: { legacyDecorator: true, decoratorMetadata: true },
      },
    }),
  ],
  test: {
    environment: 'node',
    testTimeout: 20_000,
    hookTimeout: 30_000,
    fileParallelism: false,
  },
});
