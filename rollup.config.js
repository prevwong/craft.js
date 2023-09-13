const path = require('path');

const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const { terser } = require('rollup-plugin-terser');
const typescript = require('rollup-plugin-typescript');

const shouldMinify = process.env.NODE_ENV === 'production';
const bundle = ['tslib'];

module.exports = {
  input: './src/index.ts',
  output: [
    {
      dir: 'dist/esm',
      format: 'esm',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
    },
    {
      dir: 'dist/cjs',
      format: 'cjs',
    },
  ],
  external: (id) => {
    return !id.startsWith('.') && !path.isAbsolute(id) && !bundle.includes(id);
  },
  plugins: [
    resolve(),
    typescript(),
    babel({
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
        sourcemap: true,
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
