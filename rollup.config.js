import path from 'path';

import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

const shouldMinify = process.env.NODE_ENV === 'production';
const bundle = ['tslib'];

export default {
  input: './src/index.ts',
  output: [
    {
      file: 'dist/esm/index.js',
      format: 'esm',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
    },
    {
      file: 'dist/cjs/index.js',
      format: 'cjs',
    },
  ],
  external: (id) => {
    return !id.startsWith('.') && !path.isAbsolute(id) && !bundle.includes(id);
  },
  plugins: [
    resolve(),
    typescript({
      declaration: false,
      declarationDir: undefined,
      outputToFilesystem: true,
    }),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.ts'],
      presets: [
        ['@babel/preset-typescript'],
        [
          '@babel/preset-env',
          {
            modules: false,
            targets: {
              browsers: ['>0.25%, not dead'],
            },
          },
        ],
      ],
      plugins: [
        '@babel/proposal-class-properties',
        '@babel/proposal-object-rest-spread',
      ],
    }),
    shouldMinify &&
      terser({
        output: { comments: 'some' },
        compress: {
          keep_infinity: true,
          pure_getters: true,
          passes: 10,
        },
        ecma: 5,
        warnings: true,
        mangle: {
          reserved: ['Canvas'],
        },
      }),
  ],
};
