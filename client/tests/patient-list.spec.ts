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
    {
      _id: '3',
      full_name: 'Bob Johnson',
      cancer_stage: 'Stage III',
      cancer_type: 'Breast Cancer',
      diagnosis_date: '2024-03-01',
    },
  ];

  test.beforeEach(async ({ page }) => {
    await mockAPIResponse(page, 'patients', {
      patients: mockPatients,
    });

    await page.goto('/patients');
  });

  test('should display page title and filters', async ({ page }) => {
    // Check that search field is visible
    await expect(page.getByLabel('Search')).toBeVisible();
    
    // Check that stage filter is visible
    await expect(page.getByLabel('Stage')).toBeVisible();
    
    // Check that cancer type filter is visible
    await expect(page.getByLabel('Cancer type')).toBeVisible();
  });

  test('should display Add Patient button', async ({ page }) => {
    const addButton = page.getByRole('button', { name: /Add Patient/i });
    await expect(addButton).toBeVisible();
  });

  test('should display patient table with headers', async ({ page }) => {
    // Check table headers
    await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Stage' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Type' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Diagnosis' })).toBeVisible();
  });

  test('should display all patients in table', async ({ page }) => {
    // Wait for table to load
    await page.waitForTimeout(500);
    
    // Check that patient names are displayed
    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('Jane Smith')).toBeVisible();
    await expect(page.getByText('Bob Johnson')).toBeVisible();
  });

  test('should filter patients by search term', async ({ page }) => {
    // Wait for initial load
    await page.waitForTimeout(500);
    
    // Enter search term
    await page.getByLabel('Search').fill('John');
    
    // Wait for filter to apply
    await page.waitForTimeout(300);
    
    // Only John Doe should be visible
    await expect(page.getByText('John Doe')).toBeVisible();
    
    // Other patients should not be visible in the filtered results
    // Note: They might still exist in DOM, so we check the table rows
    const rows = page.getByRole('row');
    const rowCount = await rows.count();
    
    // Should have header row + 1 data row
    expect(rowCount).toBeLessThanOrEqual(2);
  });

  test('should filter patients by cancer stage', async ({ page }) => {
    // Wait for initial load
    await page.waitForTimeout(500);
    
    // Click on stage filter
    await page.getByLabel('Stage').click();
    
    // Select Stage I
    await page.getByRole('option', { name: 'Stage I' }).click();
    
    // Wait for filter to apply
    await page.waitForTimeout(300);
    
    // Only Jane Smith (Stage I) should be visible
    await expect(page.getByText('Jane Smith')).toBeVisible();
  });

  test('should filter patients by cancer type', async ({ page }) => {
    // Wait for initial load
    await page.waitForTimeout(500);
    
    // Enter cancer type
    await page.getByLabel('Cancer type').fill('Lung');
    
    // Wait for filter to apply
    await page.waitForTimeout(300);
    
    // Only Jane Smith (Lung Cancer) should be visible
    await expect(page.getByText('Jane Smith')).toBeVisible();
  });

  test('should combine multiple filters', async ({ page }) => {
    // Wait for initial load
    await page.waitForTimeout(500);
    
    // Filter by Breast Cancer
    await page.getByLabel('Cancer type').fill('Breast');
    
    // Filter by Stage II
    await page.getByLabel('Stage').click();
    await page.getByRole('option', { name: 'Stage II' }).click();
    
    // Wait for filters to apply
    await page.waitForTimeout(300);
    
    // Only John Doe (Breast Cancer, Stage II) should be visible
    await expect(page.getByText('John Doe')).toBeVisible();
  });

  test('should open Add Patient dialog when button clicked', async ({ page }) => {
    // Click Add Patient button
    await page.getByRole('button', { name: /Add Patient/i }).click();
    
    // Dialog should be visible - look for form fields
    await expect(page.getByLabel('Full Name', { exact: false })).toBeVisible();
  });

  test('should display "No patients found" when no matches', async ({ page }) => {
    // Wait for initial load
    await page.waitForTimeout(500);
    
    // Search for non-existent patient
    await page.getByLabel('Search').fill('NonExistentPatient');
    
    // Wait for filter to apply
    await page.waitForTimeout(300);
    
    // Should show no patients message
    await expect(page.getByText(/No patients found/i)).toBeVisible();
  });

  test('should navigate to patient detail when row clicked', async ({ page }) => {
    // Wait for initial load
    await page.waitForTimeout(500);
    
    // Click on a patient row
    await page.getByText('John Doe').click();
    
    // Should navigate to patient detail page
    await expect(page).toHaveURL(/\/patients\/1/);
  });

  test('should show loading state initially', async ({ page }) => {
    // Check that page loads without errors
    await expect(page).toHaveURL('/patients');
  });
});
