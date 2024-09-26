import { createDefaultEsmPreset, type JestConfigWithTsJest } from 'ts-jest'

const defaultEsmPreset = createDefaultEsmPreset(
  
)

const jestConfig: JestConfigWithTsJest = {
  // [...]
  ...defaultEsmPreset,
  transform: {
    "^.+.(t|j)sx?$": ["ts-jest",{
      useESM: true,
      tsconfig: "./tsconfig-jest.json"
    }],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  }
}

export default jestConfig