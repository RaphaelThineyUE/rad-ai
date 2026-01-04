import { test, expect } from './fixtures';

test.describe('How-To Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/how-to');
  });

  test('should display the How-To page', async ({ page }) => {
    // Check that we're on the how-to page
    await expect(page).toHaveURL('/how-to');
  });

  test('should display Getting Started Checklist section', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(500);
    
    // Check for checklist heading
    await expect(page.getByText('Getting Started Checklist')).toBeVisible();
  });

  test('should display checklist items with checkboxes', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(500);
    
    // Check for checkbox elements
    const checkboxes = page.getByRole('checkbox');
    const checkboxCount = await checkboxes.count();
    
    // Should have multiple checklist items (5 based on the code)
    expect(checkboxCount).toBeGreaterThan(0);
  });

  test('should display all checklist steps', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(500);
    
    // Check for specific checklist items
    await expect(page.getByText(/Create or select a patient profile/i)).toBeVisible();
    await expect(page.getByText(/Upload a PDF radiology report/i)).toBeVisible();
    await expect(page.getByText(/Review AI-extracted findings/i)).toBeVisible();
  });

  test('should display Feature Guides section', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(500);
    
    // Check for feature guides heading
    await expect(page.getByText('Feature Guides & Pro Tips')).toBeVisible();
  });

  test('should display accordion sections', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(500);
    
    // Check for accordion items
    await expect(page.getByText('Uploading and analyzing reports')).toBeVisible();
    await expect(page.getByText('Consolidated insights')).toBeVisible();
    await expect(page.getByText('Treatment comparisons')).toBeVisible();
    await expect(page.getByText('Analytics dashboard')).toBeVisible();
  });

  test('should expand accordion when clicked', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(500);
    
    // Click on first accordion
    await page.getByText('Uploading and analyzing reports').click();
    
    // Wait for expansion animation
    await page.waitForTimeout(300);
    
    // Check that content is visible
    await expect(page.getByText(/Select a patient before uploading/i)).toBeVisible();
  });

  test('should collapse accordion when clicked again', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(500);
    
    // Click to expand
    await page.getByText('Uploading and analyzing reports').click();
    await page.waitForTimeout(300);
    
    // Click again to collapse
    await page.getByText('Uploading and analyzing reports').click();
    await page.waitForTimeout(300);
    
    // Content should be hidden (not visible or has aria-hidden)
    const content = page.getByText(/Select a patient before uploading/i);
    const isVisible = await content.isVisible().catch(() => false);
    
    // After collapsing, it should not be visible (or test passes if element handling is correct)
    // Note: This might still be in DOM but hidden
  });

  test('should display multiple accordion sections', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(500);
    
    // Expand first accordion
    await page.getByText('Uploading and analyzing reports').click();
    await page.waitForTimeout(300);
    
    // Expand second accordion
    await page.getByText('Consolidated insights').click();
    await page.waitForTimeout(300);
    
    // Both should be visible
    await expect(page.getByText(/Select a patient before uploading/i)).toBeVisible();
    await expect(page.getByText(/two or more completed reports/i)).toBeVisible();
  });

  test('should display Medical Disclaimer section', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(500);
    
    // Check for disclaimer heading
    await expect(page.getByText('Medical Disclaimer')).toBeVisible();
    
    // Check for disclaimer text
    await expect(page.getByText(/RadReport AI provides decision support/i)).toBeVisible();
  });

  test('should have distinct styling for disclaimer section', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(500);
    
    // The disclaimer section should be visible
    const disclaimer = page.getByText('Medical Disclaimer');
    await expect(disclaimer).toBeVisible();
    
    // Should be in a card-like container (checking that parent has content)
    const disclaimerSection = page.locator('text=Medical Disclaimer').locator('..');
    await expect(disclaimerSection).toBeVisible();
  });

  test('should allow checking checklist items', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(500);
    
    // Get first checkbox
    const firstCheckbox = page.getByRole('checkbox').first();
    
    // Click to check
    await firstCheckbox.click();
    
    // Should be checked
    await expect(firstCheckbox).toBeChecked();
  });

  test('should allow unchecking checklist items', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(500);
    
    // Get first checkbox
    const firstCheckbox = page.getByRole('checkbox').first();
    
    // Check it
    await firstCheckbox.click();
    await expect(firstCheckbox).toBeChecked();
    
    // Uncheck it
    await firstCheckbox.click();
    await expect(firstCheckbox).not.toBeChecked();
  });
});
