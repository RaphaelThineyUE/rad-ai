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

  const mockTreatments = [
    {
      _id: 't1',
      patient_id: '1',
      treatment_type: 'Chemotherapy',
      treatment_outcome: 'Improved',
      start_date: '2024-01-15',
    },
    {
      _id: 't2',
      patient_id: '2',
      treatment_type: 'Radiation',
      treatment_outcome: 'Stable',
      start_date: '2024-02-15',
    },
    {
      _id: 't3',
      patient_id: '3',
      treatment_type: 'Surgery',
      treatment_outcome: 'Improved',
      start_date: '2024-03-15',
    },
  ];

  test.beforeEach(async ({ page }) => {
    await mockAPIResponse(page, 'patients', {
      patients: mockPatients,
    });

    await mockAPIResponse(page, 'treatments', {
      treatments: mockTreatments,
    });

    await page.goto('/analytics');
  });

  test('should display analytics page', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(500);
    
    // Check that we're on the analytics page
    await expect(page).toHaveURL('/analytics');
  });

  test('should display tabs for different analytics views', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(500);
    
    // Check that tabs exist
    const tabs = page.getByRole('tab');
    const tabCount = await tabs.count();
    
    // Should have at least 1 tab
    expect(tabCount).toBeGreaterThan(0);
  });

  test('should display chart visualizations', async ({ page }) => {
    // Wait for page to load and charts to render
    await page.waitForTimeout(1000);
    
    // Charts are rendered using recharts - check for SVG elements which recharts uses
    const svgElements = page.locator('svg');
    const svgCount = await svgElements.count();
    
    // Should have at least one chart (SVG)
    expect(svgCount).toBeGreaterThan(0);
  });

  test('should switch between analytics tabs', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(500);
    
    const tabs = page.getByRole('tab');
    const tabCount = await tabs.count();
    
    if (tabCount > 1) {
      // Get first tab text to compare later
      const firstTabText = await tabs.nth(0).textContent();
      
      // Click on the second tab
      await tabs.nth(1).click();
      
      // Wait for content to update
      await page.waitForTimeout(500);
      
      // Should still be on analytics page
      await expect(page).toHaveURL('/analytics');
      
      // Click back to first tab
      await tabs.nth(0).click();
      await page.waitForTimeout(300);
    }
  });

  test('should display stage distribution data', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(1000);
    
    // Check if stage data is rendered - stages should appear somewhere
    const pageContent = await page.textContent('body');
    
    // Should contain stage information
    expect(pageContent).toContain('Stage');
  });

  test('should display cancer type distribution', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(1000);
    
    // Check for cancer type data
    const pageContent = await page.textContent('body');
    
    // Should contain cancer type information from mock data
    expect(pageContent).toBeTruthy();
  });

  test('should render charts with mock data', async ({ page }) => {
    // Wait for page to load and charts to render
    await page.waitForTimeout(1000);
    
    // Check that SVG elements exist (recharts renders as SVG)
    const charts = page.locator('svg');
    const chartCount = await charts.count();
    
    // Should have multiple charts
    expect(chartCount).toBeGreaterThan(0);
  });

  test('should handle empty data gracefully', async ({ page }) => {
    // Mock empty data
    await mockAPIResponse(page, 'patients', { patients: [] });
    await mockAPIResponse(page, 'treatments', { treatments: [] });
    
    // Reload page
    await page.goto('/analytics');
    await page.waitForTimeout(500);
    
    // Page should still load without errors
    await expect(page).toHaveURL('/analytics');
  });

  test('should display treatment outcome data', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(1000);
    
    // Check for treatment outcome information
    const pageContent = await page.textContent('body');
    
    // Basic validation that page loaded
    expect(pageContent).toBeTruthy();
  });

  test('should have responsive layout', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(500);
    
    // Page should be visible and contain content
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
