import typescript from 'rollup-plugin-typescript2'
import path from 'path';
import { terser } from 'rollup-plugin-terser'
import image from '@rollup/plugin-image'


export default [
  {
    input: 'src/index.tsx',
    output: {
      dir: "dist",
      format: "esm"
    },
    plugins: [
      image(),
      typescript(),
      terser()
    ]
  }
]
