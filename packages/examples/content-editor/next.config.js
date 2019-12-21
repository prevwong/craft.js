const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules')
const withCSS = require('@zeit/next-css')


let plugins = [
  [withCSS]
];

if ( process.env.NODE_ENV == "production" ) {
  plugins = [
    ...plugins,
    [withTM, {
      transpileModules: ['craftjs']
    }],
  ]
}

module.exports = withPlugins(plugins, {
  assetPrefix: process.env.NODE_ENV === 'production' ? '/craft.js' : '',
});