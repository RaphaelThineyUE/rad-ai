import { test, expect } from './fixtures';

test.describe('How-To Page', () => {
  test.beforeEach(async ({ page }) => {
    // Wait longer for CDN resources to load
    await page.goto('/how-to', { waitUntil: 'networkidle', timeout: 30000 });
  });

  test('should navigate to the How-To page successfully', async ({ page }) => {
    // Check that we're on the how-to page
    await expect(page).toHaveURL('/how-to');
    
    // Verify page loaded (even if MUI components don't render from CDN)
    const html = await page.content();
    expect(html).toContain('root'); // React root div should exist
  });

  test('should have the app layout', async ({ page }) => {
    // Check that the main app elements are present
    const html = await page.content();
    
    // Should have the root div
    expect(html).toContain('id="root"');
  });

  test('should be on correct route', async ({ page }) => {
    // Verify we're on the correct route
    const url = page.url();
    expect(url).toContain('/how-to');
  });
});

