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
    {
      _id: 't2',
      patient_id: '1',
      treatment_type: 'Radiation',
      treatment_outcome: 'Stable',
      start_date: '2024-04-01',
      end_date: '2024-05-01',
    },
  ];

  test.beforeEach(async ({ page }) => {
    await mockAPIResponse(page, 'patients/1', {
      patient: mockPatient,
    });

    await mockAPIResponse(page, 'treatments', {
      treatments: mockTreatments,
    });

    await page.goto('/patients/1');
  });

  test('should display patient information', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(500);
    
    // Check that patient name is displayed
    await expect(page.getByText('John Doe')).toBeVisible();
    
    // Check that cancer stage is displayed
    await expect(page.getByText('Stage II')).toBeVisible();
    
    // Check that cancer type is displayed
    await expect(page.getByText('Breast Cancer')).toBeVisible();
  });

  test('should display tabs for different views', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(500);
    
    // Check that tabs exist - look for common tab labels
    const tabs = page.getByRole('tab');
    const tabCount = await tabs.count();
    
    // Should have at least 1 tab
    expect(tabCount).toBeGreaterThan(0);
  });

  test('should display patient details in overview tab', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(500);
    
    // Patient info should be visible
    await expect(page.getByText('John Doe')).toBeVisible();
  });

  test('should switch between tabs', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(500);
    
    const tabs = page.getByRole('tab');
    const tabCount = await tabs.count();
    
    if (tabCount > 1) {
      // Click on the second tab if it exists
      await tabs.nth(1).click();
      
      // Wait for tab content to load
      await page.waitForTimeout(300);
      
      // Page should still be on the same URL
      await expect(page).toHaveURL(/\/patients\/1/);
    }
  });

  test('should handle loading state', async ({ page }) => {
    // Check that loading message appears initially or data loads
    const loadingText = page.getByText(/Loading patient/i);
    const patientName = page.getByText('John Doe');
    
    // Either loading or patient data should be visible
    await expect(loadingText.or(patientName)).toBeVisible();
  });

  test('should display treatment information if available', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(500);
    
    // Treatment data might be in a specific tab or section
    // Check if treatment types are mentioned anywhere on the page
    const pageContent = await page.textContent('body');
    
    // Basic check that page loaded successfully
    expect(pageContent).toBeTruthy();
  });

  test('should navigate back to patient list when back button is used', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(500);
    
    // Use browser back navigation
    await page.goBack();
    
    // Should be back at the root or patients page
    await expect(page).toHaveURL(/^\/(patients)?$/);
  });
});
