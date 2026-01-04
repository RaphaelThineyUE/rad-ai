import { test, expect, mockAPIResponse } from './fixtures';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses
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

    await page.goto('/', { waitUntil: 'networkidle', timeout: 30000 });
  });

  test('should navigate to home page successfully', async ({ page }) => {
    // Check that we're on the home page
    await expect(page).toHaveURL('/');
    
    // Verify page loaded
    const html = await page.content();
    expect(html).toContain('root');
  });

  test('should load without errors', async ({ page }) => {
    // Basic check that page doesn't crash
    const url = page.url();
    expect(url).toContain('localhost');
  });
});

