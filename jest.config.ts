import type {Config} from 'jest';

const config: Config = {
  clearMocks: true,
  testEnvironment: "node",
  preset: "ts-jest/presets/default-esm",
  transform: {
    "^.+.(t|j)sx?$": ["ts-jest",{"useESM": true}],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
export default config;