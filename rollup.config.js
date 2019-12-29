import path from 'path'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript'
import babel from 'rollup-plugin-babel'

const shouldMinify = process.env.NODE_ENV == 'PRODUCTION';
const bundle = ['@craftjs/utils', 'tslib'];

export default {
  input: "./src/index.ts",
  output: [
    {
      dir: "dist/esm",
      format: "esm",
      globals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
      },
    },
    {
      dir: "dist/cjs",
      format: "cjs"
    }
  ],
  external: id => {
    return !id.startsWith('.') && !path.isAbsolute(id) && !bundle.includes(id);
  },
  plugins: [
    resolve(),
    typescript(),
    babel(),
    shouldMinify &&
      terser({
        sourcemap: true,
        output: { comments: false },
        compress: {
          keep_infinity: true,
          pure_getters: true,
          passes: 10,
        },
        ecma: 5,
        toplevel: opts.format === 'cjs',
        warnings: true,
      }),
  ]
}