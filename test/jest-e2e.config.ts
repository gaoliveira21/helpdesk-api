import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/../src/$1',
  },
  globalSetup: '<rootDir>/jest-e2e.setup.ts',
  globalTeardown: '<rootDir>/jest-e2e.teardown.ts',
  transformIgnorePatterns: ['node_modules/(?!(uuid)/)'],
};

export default config;
