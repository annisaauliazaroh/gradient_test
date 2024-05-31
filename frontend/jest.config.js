module.exports = {
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],  // Add 'jsx' here
    moduleNameMapper: {
      '\\.(css|less)$': 'identity-obj-proxy'
    },
  };
  