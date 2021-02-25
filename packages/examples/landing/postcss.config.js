const purgecss = require('@fullhuman/postcss-purgecss')({
  content: ['./components/**/*.tsx', './pages/**/*.tsx'],
  defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
});

const cssnano = require('cssnano')({
  preset: 'default',
});

module.exports = {
  plugins: {
    'postcss-import': {},
    tailwindcss: {},
    'autoprefixer': {},
    ...(process.env.NODE_ENV === 'production' ? [purgecss, cssnano] : []),
  },
};
