// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {

  moduleFileExtensions: [
    'js',
    'ts',
    'json'
  ],

  preset: 'ts-jest',

  testEnvironment: 'node',

  testMatch: [
    //'**/?(*.)+(spec|test).js?(x)',
    '**/?(*.)+(spec|test).ts?(x)',
  ],

  transform: {},

};
