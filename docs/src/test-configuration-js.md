---
id: test-configuration
title: "Test configuration"
---

Playwright has many options to configure how your tests are run. You can specify these options in the configuration file. Note that test runner options are **top-level**, do not put them into the `use` section.

## Basic Configuration

Here are some of the most common configuration options.

```js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Look for test files in the "tests" directory, relative to this configuration file.
  testDir: 'tests',

  // Run all tests in parallel.
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,

  // Retry on CI only.
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI.
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: 'html',

  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    baseURL: 'http://127.0.0.1:3000',

    // Collect trace when retrying the failed test.
    trace: 'on-first-retry',
  },
  // Configure projects for major browsers.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Run your local dev server before starting the tests.
  webServer: {
    command: 'npm run start',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

| Option | Description |
| :- | :- |
| [`property: TestConfig.forbidOnly`] | Whether to exit with an error if any tests are marked as `test.only`. Useful on CI.|
| [`property: TestConfig.fullyParallel`] | have all tests in all files to run in parallel. See [/Parallelism and sharding](./test-parallel) for more details. |
| [`property: TestConfig.projects`] | Run tests in multiple configurations or on multiple browsers |
| [`property: TestConfig.reporter`] | Reporter to use. See [Test Reporters](/test-reporters.md) to learn more about which reporters are available. |
| [`property: TestConfig.retries`] | The maximum number of retry attempts per test. See [Test Retries](/test-retries.md) to learn more about retries.|
| [`property: TestConfig.testDir`] | Directory with the test files. |
| [`property: TestConfig.use`]  | Options with `use{}` |
| [`property: TestConfig.webServer`] | To launch a server during the tests, use the `webServer` option |
| [`property: TestConfig.workers`] | The maximum number of concurrent worker processes to use for parallelizing tests. Can also be set as percentage of logical CPU cores, e.g. `'50%'.`. See [/Parallelism and sharding](./test-parallel) for more details. |

## Filtering Tests

Filter tests by glob patterns or regular expressions.

```js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Glob patterns or regular expressions to ignore test files. 
  testIgnore: '*test-assets',

  // Glob patterns or regular expressions that match test files. 
  testMatch: '*todo-tests/*.spec.ts',
});
```

| Option | Description |
| :- | :- |
| [`property: TestConfig.testIgnore`] | Glob patterns or regular expressions that should be ignored when looking for the test files. For example, `'*test-assets'` |
| [`property: TestConfig.testMatch`] | Glob patterns or regular expressions that match test files. For example, `'*todo-tests/*.spec.ts'`. By default, Playwright runs `.*(test|spec)\.(js|ts|mjs)` files. |

## Advanced Configuration

```js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Folder for test artifacts such as screenshots, videos, traces, etc.
  outputDir: 'test-results',

  // path to the global setup files.
  globalSetup: require.resolve('./global-setup'),

  // path to the global teardown files.
  globalTeardown: require.resolve('./global-teardown'),

  // Each test is given 30 seconds.
  timeout: 30000,

});
```

| Option | Description |
| :- | :- |
| [`property: TestConfig.globalSetup`] | Path to the global setup file. This file will be required and run before all the tests. It must export a single function. |
| [`property: TestConfig.globalTeardown`] |Path to the global teardown file. This file will be required and run after all the tests. It must export a single function. |
| [`property: TestConfig.outputDir`] | Folder for test artifacts such as screenshots, videos, traces, etc. |
| [`property: TestConfig.timeout`] | Playwright enforces a [timeout](./test-timeouts.md) for each test, 30 seconds by default. Time spent by the test function, fixtures, beforeEach and afterEach hooks is included in the test timeout. |

## Expect Options

Configuration for the expect assertion library.

```js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  expect: {
    // Maximum time expect() should wait for the condition to be met.
    timeout: 5000,

    toHaveScreenshot: {
      // An acceptable amount of pixels that could be different, unset by default.
      maxDiffPixels: 10,
    },

    toMatchSnapshot:  {
      // An acceptable ratio of pixels that are different to the total amount of pixels, between 0 and 1.
      maxDiffPixelRatio: 10,
    },
  },
  
});
```

| Option | Description |
| :- | :- |
| [`property: TestConfig.expect`] | [Web first assertions](./test-assertions.md) like `expect(locator).toHaveText()` have a separate timeout of 5 seconds by default. This is the maximum time the `expect()` should wait for the condition to be met. Learn more about [test and expect timeouts](./test-timeouts.md) and how to set them for a single test. |
| [`method: PageAssertions.toHaveScreenshot#1`] | Configuration for the `expect(locator).toHaveScreeshot()` method. |
| [`method: SnapshotAssertions.toMatchSnapshot#1`]| Configuration for the `expect(locator).toMatchSnapshot()` method.|


### Add custom matchers using expect.extend

You can extend Playwright assertions by providing custom matchers. These matchers will be available on the `expect` object.

In this example we add a custom `toBeWithinRange` function in the configuration file. Custom matcher should return a `message` callback and a `pass` flag indicating whether the assertion passed.

```js tab=js-js
// playwright.config.js
const { expect } = require('@playwright/test');

expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => 'passed',
        pass: true,
      };
    } else {
      return {
        message: () => 'failed',
        pass: false,
      };
    }
  },
});

module.exports = {};
```

```js tab=js-ts
// playwright.config.ts
import { expect, PlaywrightTestConfig } from '@playwright/test';

expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => 'passed',
        pass: true,
      };
    } else {
      return {
        message: () => 'failed',
        pass: false,
      };
    }
  },
});

import { defineConfig } from '@playwright/test';
export default defineConfig({});
```

Now we can use `toBeWithinRange` in the test.
```js tab=js-js
// example.spec.js
const { test, expect } = require('@playwright/test');

test('numeric ranges', () => {
  expect(100).toBeWithinRange(90, 110);
  expect(101).not.toBeWithinRange(0, 100);
});
```

```js tab=js-ts
// example.spec.ts
import { test, expect } from '@playwright/test';

test('numeric ranges', () => {
  expect(100).toBeWithinRange(90, 110);
  expect(101).not.toBeWithinRange(0, 100);
});
```

:::note
Do not confuse Playwright's `expect` with the [`expect` library](https://jestjs.io/docs/expect). The latter is not fully integrated with Playwright test runner, so make sure to use Playwright's own `expect`.
:::

For TypeScript, also add the following to your [`global.d.ts`](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-d-ts.html). If it does not exist, you need to create it inside your repository. Make sure that your `global.d.ts` gets included inside your `tsconfig.json` via the `include` or `compilerOptions.typeRoots` option so that your IDE will pick it up.

You don't need it for JavaScript.

```js
// global.d.ts
export {};

declare global {
 namespace PlaywrightTest {
    interface Matchers<R, T> {
      toBeWithinRange(a: number, b: number): R;
    }
  }
}
```
