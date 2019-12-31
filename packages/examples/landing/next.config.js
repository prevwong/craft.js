const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules')
const withCSS = require('@zeit/next-css')


let plugins = [
  [withCSS]
];

if ( process.env.NODE_ENV != "production" ) {
  plugins.push(
    [withTM, {
      transpileModules: ['@craftjs/core', '@craftjs/utils', '@craftjs/layers']
    }]
  )
}

module.exports = withPlugins(plugins, {
  assetPrefix: '',
});