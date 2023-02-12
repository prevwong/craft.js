/** @type {import('ts-jest').JestConfigWithTsJest} */

const esModules = ['nanoid'].join('|');

module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest/setup.js'],
  clearMocks: true,
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/packages/**/?(*.)test.ts(x|)'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.jest.json',
      },
    ],
  },
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
  moduleNameMapper: {
    '^nanoid(/(.*)|$)': 'nanoid$1',
  },
};
