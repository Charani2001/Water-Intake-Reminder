// config/jest.config.js
module.exports = {
    testEnvironment: 'jsdom',
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest"
    },
    transformIgnorePatterns: [
      "node_modules/(?!(axios)/)"
    ],
    moduleNameMapper: {
      "^axios$": "<rootDir>/node_modules/axios/index.js"
    },
    testMatch: [
      "**/src/**/*.test.js",
      "**/src/**/*.spec.js",
      "**/src/**/*.{test,spec}.{js,jsx,ts,tsx}"
    ]
  };
  