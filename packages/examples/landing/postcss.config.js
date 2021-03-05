const purgecss = {
  content: ['./components/**/*.tsx', './pages/**/*.tsx'],
  defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
};

const cssnano = {
  preset: 'default',
};

module.exports = {
  plugins: {
    'postcss-import': {},
    tailwindcss: {},
    'autoprefixer': {},
    ...(process.env.NODE_ENV === 'production' ? {'@fullhuman/postcss-purgecss': purgecss, 'cssnano': cssnano} : []),
  },
};
