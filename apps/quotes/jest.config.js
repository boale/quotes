const baseJestConfig = {
  displayName: 'quotes',
  preset: 'jest-preset-angular', // "jest-preset-angular",
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  testPathIgnorePatterns: [
    '/environments/',
    "/node_modules/"
  ],
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
      diagnostics: true,
      ignoreCodes: [151001],
      stringifyContentPathRegex: '\\.(html|svg)$',
      astTransformers: {
        before: [
          'jest-preset-angular/build/InlineFilesTransformer',
          'jest-preset-angular/build/StripStylesTransformer',
        ],
      },
    },
  },
  coverageDirectory: '../../coverage/apps/quotes',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  collectCoverageFrom: ["**/*.ts"],
  coveragePathIgnorePatterns: [
    ".*\\.mock.ts$",
    ".*\\.module.ts$",
    ".*\\.config.ts$",
    ".*\\.models.ts$",
    ".*\\.directive.ts$",
    ".*\\.font.ts$",
    ".*\\.worker.ts$",
    "utag.service.ts",
    "index.ts",
    "/store/",
    "/environments/",
    "/utils/",
    "/assets/",
    "/text/",
  ],
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

const ciSpecificConfig = {
  collectCoverage: true,
  coverageReporters: ["lcovonly", "text-summary"],
};

/**
 * By default collecting the coverage is disable for development.
 * In order to enable it we use jest CLI option `--coverage`
 */
const devSpecificConfig = {
  coverageReporters: ["lcov", "text-summary"],
};

const jestDevCiSpecificConfig = process.env.TEST_ENV_CI
  ? ciSpecificConfig
  : devSpecificConfig;

module.exports = {
  ...baseJestConfig,
  ...jestDevCiSpecificConfig,
}
