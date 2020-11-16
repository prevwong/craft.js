import image from '@svgr/rollup';

import config from '../../rollup.config';

export default {
  ...config,
  input: './src/index.ts',
  plugins: [...config.plugins, image()],
};
