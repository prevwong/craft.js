import config from "../../rollup.config";
import image from "@svgr/rollup";

export default {
  ...config,
  input: "./src/index.tsx",
  plugins: [...config.plugins, image()],
};
