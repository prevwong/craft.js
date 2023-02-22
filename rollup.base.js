const path = require('path');

const inject = require('@rollup/plugin-inject');
const esbuild = require('rollup-plugin-esbuild');
const resolve = require('rollup-plugin-node-resolve');
const peerDepsExternal = require('rollup-plugin-peer-deps-external');
const ts = require('typescript');

const external = (id) =>
  !id.startsWith('.') &&
  !id.startsWith(process.platform === 'win32' ? path.resolve('/') : '/');

// import { getConfig } from '../../rollup.base';
/**
 * @param {object} opt
 * @param {string} opt.root
 * @param {string} opt.out
 */
function TypescriptPlugin(opt) {
  return {
    name: 'TypescriptPlugin',

    /**
     * @param {import('rollup').InputOptions}
     */
    buildStart(option) {
      let input = option.input;
      if (typeof input === 'string') {
        input = [input];
      }

      const program = ts.createProgram(input, {
        declaration: true,
        declarationMap: true,
        emitDeclarationOnly: true,
        skipLibCheck: true,
        jsx: ts.JsxEmit.React,
        esModuleInterop: true,
        rootDir: opt.root,
        outDir: opt.out,
        sourceMap: false,
      });

      program.emit();
    },
  };
}

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

/**
 * @param {string} patternInputs
 */
export const getConfig = (patternInputs, extraPlugins = []) => {
  const baseConfig = {
    input: path.join(__dirname, patternInputs),
    external,
    output: [
      {
        format: 'cjs',
        dir: path.join(__dirname, 'dist'),
        entryFileNames: '[name].js',
        preserveModules: true,
      },
      {
        format: 'es',
        dir: path.join(__dirname, 'dist'),
        entryFileNames: '[name].es.js',
        preserveModules: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve({ extensions }),
      esbuild.default({
        exclude: 'node_modules/*',
      }),
      inject({
        include: /\.tsx$/,
        modules: {
          React: 'react',
        },
      }),
      TypescriptPlugin({
        root: path.join(__dirname, 'src'),
        out: path.join(__dirname, 'dist'),
      }),
      ...extraPlugins,
    ],
  };

  return baseConfig;
};
