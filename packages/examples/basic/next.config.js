const withCSS = require('@zeit/next-css');
const withPlugins = require('next-compose-plugins');

module.exports = withPlugins([[withCSS]], {
  assetPrefix: process.env.NODE_ENV === 'production' ? '/examples/basic' : '',
});
