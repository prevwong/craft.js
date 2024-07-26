import path from 'path';

import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

const shouldMinify = process.env.NODE_ENV === 'production';
const bundle = ['tslib'];

const injectPackageVersion = () => {
  const pkg = require('./package.json');

  return `
if ( typeof window !== 'undefined' ) {
  if ( !window['__CRAFTJS__'] ) {
    window['__CRAFTJS__'] = {};
  }
  
  window['__CRAFTJS__']["${pkg.name}"] = "${pkg.version}";
}
  `;
};

export default {
  input: './src/index.ts',
  output: [
    {
      file: 'dist/esm/index.js',
      format: 'esm',
      intro: injectPackageVersion(),
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
      sourcemap: true,
    },
    {
      file: 'dist/cjs/index.js',
      intro: injectPackageVersion(),
      format: 'cjs',
      sourcemap: true,
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
