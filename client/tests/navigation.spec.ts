import { test, expect, mockAPIResponse } from './fixtures';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Mock basic API responses for all pages
    await mockAPIResponse(page, 'patients', {
      patients: [
        {
          _id: '1',
          full_name: 'John Doe',
          cancer_stage: 'Stage II',
          cancer_type: 'Breast Cancer',
          diagnosis_date: '2024-01-01',
        },
      ],
    });

    await mockAPIResponse(page, 'reports', {
      reports: [],
    });

    await mockAPIResponse(page, 'treatments', {
      treatments: [],
    });

    await page.goto('/');
  });

  test('should navigate to home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
  });

  test('should navigate to patients page', async ({ page }) => {
    await page.goto('/patients');
    await expect(page).toHaveURL('/patients');
  });

  test('should navigate to analytics page', async ({ page }) => {
    await page.goto('/analytics');
    await expect(page).toHaveURL('/analytics');
  });

  test('should navigate to how-to page', async ({ page }) => {
    await page.goto('/how-to');
    await expect(page).toHaveURL('/how-to');
  });

  test('should redirect unknown routes to home', async ({ page }) => {
    await page.goto('/unknown-route');
    await page.waitForTimeout(500);
    
    // Should redirect to home page
    await expect(page).toHaveURL('/');
  });

  test('should maintain navigation across page transitions', async ({ page }) => {
    // Start at home
    await page.goto('/');
    await expect(page).toHaveURL('/');
    
    // Navigate to patients
    await page.goto('/patients');
    await expect(page).toHaveURL('/patients');
    
    // Navigate to analytics
    await page.goto('/analytics');
    await expect(page).toHaveURL('/analytics');
    
    // Navigate to how-to
    await page.goto('/how-to');
    await expect(page).toHaveURL('/how-to');
    
    // Back to home
    await page.goto('/');
    await expect(page).toHaveURL('/');
  });

  test('should use browser back button correctly', async ({ page }) => {
    // Navigate through pages
    await page.goto('/');
    await page.goto('/patients');
    await page.goto('/analytics');
    
    // Go back
    await page.goBack();
    await expect(page).toHaveURL('/patients');
    
    // Go back again
    await page.goBack();
    await expect(page).toHaveURL('/');
  });

  test('should use browser forward button correctly', async ({ page }) => {
    // Navigate through pages
    await page.goto('/');
    await page.goto('/patients');
    await page.goto('/analytics');
    
    // Go back twice
    await page.goBack();
    await page.goBack();
    
    // Go forward
    await page.goForward();
    await expect(page).toHaveURL('/patients');
  });
});
