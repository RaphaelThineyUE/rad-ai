import { test as base } from '@playwright/test';

/**
 * Test fixtures and utilities for rad-ai tests
 */

// Extend basic test with custom fixtures
export const test = base.extend({
  // Add any custom fixtures here if needed
});

export { expect } from '@playwright/test';

/**
 * Mock API responses helper
 */
export async function mockAPIResponse(page: any, endpoint: string, response: any) {
  await page.route(`**/api/${endpoint}**`, async (route: any) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(response),
    });
  });
}

/**
 * Wait for the page to be fully loaded
 */
export async function waitForPageLoad(page: any) {
  await page.waitForLoadState('networkidle');
}
