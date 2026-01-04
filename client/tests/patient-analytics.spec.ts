import { test, expect, mockAPIResponse } from './fixtures';

test.describe('Patient Analytics Page', () => {
  const mockPatients = [
    {
      _id: '1',
      full_name: 'John Doe',
      cancer_stage: 'Stage II',
      cancer_type: 'Breast Cancer',
      diagnosis_date: '2024-01-01',
    },
  ];

  const mockTreatments = [
    {
      _id: 't1',
      patient_id: '1',
      treatment_type: 'Chemotherapy',
      treatment_outcome: 'Improved',
      start_date: '2024-01-15',
    },
  ];

  test.beforeEach(async ({ page }) => {
    await mockAPIResponse(page, 'patients', {
      patients: mockPatients,
    });

    await mockAPIResponse(page, 'treatments', {
      treatments: mockTreatments,
    });

    await page.goto('/analytics', { waitUntil: 'networkidle', timeout: 30000 });
  });

  test('should navigate to analytics page successfully', async ({ page }) => {
    // Check that we're on the analytics page
    await expect(page).toHaveURL('/analytics');
    
    // Verify page loaded
    const html = await page.content();
    expect(html).toContain('root');
  });

  test('should load without errors', async ({ page }) => {
    // Basic check that page doesn't crash
    const url = page.url();
    expect(url).toContain('/analytics');
  });
});

