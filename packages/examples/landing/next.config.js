const withPlugins = require('next-compose-plugins');
const withCSS = require('@zeit/next-css');
const config = require('../../../config');

module.exports = withPlugins([[withCSS]], {
  assetPrefix: '',
  env: {
    url: config.url,
  },
});
