const withTypescript = require('@zeit/next-typescript')
const withTM = require('next-transpile-modules')
const withCSS = require('@zeit/next-css')

module.exports = withCSS(withTypescript(
  withTM({
    transpileModules: ['craftjs']
  })
))