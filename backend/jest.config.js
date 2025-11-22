module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/*.test.ts', '**/*.spec.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/server.ts',
    '!src/websocket.ts',
    '!src/config/**',
    '!src/utils/logger.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 68,
      lines: 75,
      statements: 76
    }
  },
  coverageDirectory: 'coverage',
  verbose: true,
  transform: {
    '^.+\\.ts$': 'ts-jest'
  }
};
