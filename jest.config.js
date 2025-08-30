const nextJest = require('next/jest');

/** @type {import('jest').Config} */
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    // Exclude Next.js route boilerplate & passive wrappers (no logic / branches)
    '!src/app/**/page.tsx',
    '!src/app/**/layout.tsx',
    '!src/app/**/loading.tsx',
    '!src/app/**/error.tsx',
    '!src/app/not-found.tsx',
    // Exclude pure type definition modules
    '!src/app/types/**',
    // Exclude env/config shells
    '!src/config/env.ts',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '<rootDir>/.next/', '.*__tests__.*'],
  coverageThreshold: {
    global: {
      lines: 50,
      statements: 50,
      branches: 60,
      functions: 60,
    },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|scss|sass|less|svg)$': '<rootDir>/test/__mocks__/styleMock.js',
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(config);
