module.exports = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
    "\\.svg$": "<rootDir>/src/__mocks__/svgrMock.js"
  },
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.test.json" }],
    "^.+\\.(js|jsx)$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.test.json" }],
  },
  maxWorkers: "100%",
  verbose: true,
};
