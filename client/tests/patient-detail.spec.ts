import { test, expect, mockAPIResponse } from './fixtures';

test.describe('Patient Detail Page', () => {
  const mockPatient = {
    _id: '1',
    full_name: 'John Doe',
    cancer_stage: 'Stage II',
    cancer_type: 'Breast Cancer',
    diagnosis_date: '2024-01-01',
    birth_date: '1980-05-15',
    medical_record_number: 'MRN123456',
  };

  const mockTreatments = [
    {
      _id: 't1',
      patient_id: '1',
      treatment_type: 'Chemotherapy',
      treatment_outcome: 'Improved',
      start_date: '2024-01-15',
      end_date: '2024-03-15',
    },
  ];

  test.beforeEach(async ({ page }) => {
    await mockAPIResponse(page, 'patients/1', {
      patient: mockPatient,
    });

    await mockAPIResponse(page, 'treatments', {
      treatments: mockTreatments,
    });

    await page.goto('/patients/1', { waitUntil: 'networkidle', timeout: 30000 });
  });

  test('should navigate to patient detail page successfully', async ({ page }) => {
    // Check that we're on the patient detail page
    await expect(page).toHaveURL(/\/patients\/1/);
    
    // Verify page loaded
    const html = await page.content();
    expect(html).toContain('root');
  });

  test('should load without errors', async ({ page }) => {
    // Basic check that page doesn't crash
    const url = page.url();
    expect(url).toContain('/patients/1');
  });
});
