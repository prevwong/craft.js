import image from '@svgr/rollup';

import { getConfig } from '../../rollup.base';

const baseConfig = getConfig('src/index.tsx', [image()]);

export default baseConfig;
