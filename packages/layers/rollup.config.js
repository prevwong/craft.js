import typescript from 'rollup-plugin-typescript'
// import { terser } from 'rollup-plugin-terser'
import image from '@svgr/rollup'



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
      // terser()
    ]
  }
]
