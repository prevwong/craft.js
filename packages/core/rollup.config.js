import path from 'path'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import replace from '@rollup/plugin-replace'

export default {
  input: path.resolve(__dirname, 'lib/index.js'),
  output: [
    {
      name: 'Craft.js',
      file: path.resolve(__dirname, 'dist/umd/craft.js'),
      format: 'umd',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM'
      },
      plugins: [
        terser()
      ]
    }
  ],
  external: ['react', 'react-dom'],
  plugins: [
    resolve(),
    commonjs({
      namedExports: {
        '../../node_modules/lodash/lodash.js': ['isEqualWith', 'debounce']
      }
    }),
    babel({
      presets: [
        [
          '@babel/env',
          {
            modules: 'false',
            targets: {
              browsers: '> 0.25%, not dead',
              node: 8,
              ie: '11'
            }
          }
        ]
      ]
    })
  ]
}
