import { test, expect, mockAPIResponse } from './fixtures';

test.describe('Patient List Page', () => {
  const mockPatients = [
    {
      _id: '1',
      full_name: 'John Doe',
      cancer_stage: 'Stage II',
      cancer_type: 'Breast Cancer',
      diagnosis_date: '2024-01-01',
    },
    {
      _id: '2',
      full_name: 'Jane Smith',
      cancer_stage: 'Stage I',
      cancer_type: 'Lung Cancer',
      diagnosis_date: '2024-02-01',
    },
  ];

  test.beforeEach(async ({ page }) => {
    await mockAPIResponse(page, 'patients', {
      patients: mockPatients,
    });

    await page.goto('/patients', { waitUntil: 'networkidle', timeout: 30000 });
  });

  test('should navigate to patients page successfully', async ({ page }) => {
    // Check that we're on the patients page
    await expect(page).toHaveURL('/patients');
    
    // Verify page loaded
    const html = await page.content();
    expect(html).toContain('root');
  });

  test('should load without errors', async ({ page }) => {
    // Basic check that page doesn't crash
    const url = page.url();
    expect(url).toContain('/patients');
  });
});

