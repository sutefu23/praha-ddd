// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultConfig = require('./jest.config.common')

module.exports = {
  ...defaultConfig,
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/*.spec.[jt]s'],
  testPathIgnorePatterns: ['integration'],
  collectCoverageFrom: ['**/*.(t|j)s'],
}
