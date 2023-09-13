const svgrRollup = require('@svgr/rollup');

const config = require('../../rollup.config');

module.exports = {
  ...config,
  input: './src/index.tsx',
  plugins: [...config.plugins, svgrRollup()],
};
