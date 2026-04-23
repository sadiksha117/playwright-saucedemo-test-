const { test, expect } = require('@playwright/test');

test('retry demo', async ({ page }, testInfo) => {
  expect(testInfo.retry).toBeGreaterThan(0);  // fails on first attempt, passes on retry
});