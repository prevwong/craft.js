const withPlugins = require("next-compose-plugins");
const withCSS = require("@zeit/next-css");

module.exports = withPlugins([[withCSS]], {
  assetPrefix: process.env.NODE_ENV === "production" ? "/examples/basic" : "",
});
