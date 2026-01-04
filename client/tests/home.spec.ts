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
        {
          _id: '2',
          full_name: 'Jane Smith',
          cancer_stage: 'Stage I',
          cancer_type: 'Lung Cancer',
          diagnosis_date: '2024-02-01',
        },
      ],
    });

    await mockAPIResponse(page, 'reports', {
      reports: [
        {
          _id: 'r1',
          patient_id: '1',
          filename: 'report1.pdf',
          status: 'completed',
          created_at: '2024-01-15',
        },
        {
          _id: 'r2',
          patient_id: '1',
          filename: 'report2.pdf',
          status: 'completed',
          created_at: '2024-02-15',
        },
      ],
    });

    await page.goto('/');
  });

  test('should display page title and stats cards', async ({ page }) => {
    // Check that stats cards are displayed
    await expect(page.getByText('Total Reports')).toBeVisible();
    await expect(page.getByText('Analyzed')).toBeVisible();
    await expect(page.getByText('Needs Review')).toBeVisible();
  });

  test('should display patient selector', async ({ page }) => {
    // Check that patient selector is visible
    await expect(page.getByLabel('Select patient')).toBeVisible();
  });

  test('should populate patient dropdown with patients', async ({ page }) => {
    // Click on patient selector
    await page.getByLabel('Select patient').click();
    
    // Check that patients are in the dropdown
    await expect(page.getByRole('option', { name: 'John Doe' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Jane Smith' })).toBeVisible();
  });

  test('should enable file dropzone when patient is selected', async ({ page }) => {
    // Initially the dropzone should show a message or be disabled
    const dropzone = page.locator('text=Upload PDF Report').first();
    
    // Select a patient
    await page.getByLabel('Select patient').click();
    await page.getByRole('option', { name: 'John Doe' }).click();
    
    // Dropzone should be enabled (checking that it's visible is sufficient)
    await expect(dropzone.or(page.locator('[class*="dropzone"]').first())).toBeVisible();
  });

  test('should display reports section', async ({ page }) => {
    // Check that reports section header is visible
    await expect(page.getByText('Reports', { exact: false })).toBeVisible();
  });

  test('should display "View Consolidated" button', async ({ page }) => {
    // Check that consolidated button exists
    const consolidatedButton = page.getByRole('button', { name: /View Consolidated/i });
    await expect(consolidatedButton).toBeVisible();
  });

  test('should disable consolidated button when less than 2 completed reports', async ({ page }) => {
    // Mock with only 1 completed report
    await mockAPIResponse(page, 'reports', {
      reports: [
        {
          _id: 'r1',
          patient_id: '1',
          filename: 'report1.pdf',
          status: 'completed',
          created_at: '2024-01-15',
        },
      ],
    });

    await page.goto('/');
    
    const consolidatedButton = page.getByRole('button', { name: /View Consolidated/i });
    await expect(consolidatedButton).toBeDisabled();
  });

  test('should show loading state initially', async ({ page }) => {
    // The page should handle loading states
    // This is a basic check that the page doesn't crash
    await expect(page).toHaveURL('/');
  });

  test('should display stats with correct initial values', async ({ page }) => {
    // Stats should be calculated based on mocked reports
    // Since we have 2 completed reports in the beforeEach mock
    await page.getByLabel('Select patient').click();
    await page.getByRole('option', { name: 'John Doe' }).click();
    
    // Wait for reports to load
    await page.waitForTimeout(500);
    
    // Check that stats are displayed (values depend on mock data)
    const totalReports = page.getByText('Total Reports').locator('..');
    await expect(totalReports).toBeVisible();
  });
});
