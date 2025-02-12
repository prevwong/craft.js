module.exports = {
  output: 'export',
  experimental: {
    appDir: false,
  },
  assetPrefix:
    process.env.NODE_ENV === 'production' ? '/examples/landing' : '/',
};
