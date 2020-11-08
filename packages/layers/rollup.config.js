import image from '@svgr/rollup';

import config from '../../rollup.config';

export default {
  ...config,
  input: './src/index.tsx',
  plugins: [...config.plugins, image()],
};
