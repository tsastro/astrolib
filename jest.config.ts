import type {Config} from 'jest';

const config: Config = {
  clearMocks: true,
  testEnvironment: "node",
  preset: "ts-jest",
  transform: {
    "^.+.(t|j)sx?$": ["ts-jest",{}],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};

export default config;