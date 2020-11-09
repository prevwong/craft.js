module.exports = {
  extends: [
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'react-app',
    "plugin:import/typescript",
  ],
  rules: {
    'no-console': 1,
    'import/no-unresolved': 2,
    'import/order': [
      'error',
      {
        alphabetize: { order: 'asc' },
        'newlines-between': 'always',
        groups: ['builtin', 'external', 'internal', 'sibling', 'index'],
        pathGroups: [{ pattern: '*', group: 'external' }],
      },
    ],
    '@typescript-eslint/no-unused-expressions': 2,
    '@typescript-eslint/no-unused-vars': 2,
  },
};
