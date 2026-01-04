# Playwright Tests for RadReport AI

This directory contains end-to-end tests for the RadReport AI client application using Playwright.

## Test Structure

- `fixtures.ts` - Common test fixtures and utilities for API mocking
- `home.spec.ts` - Tests for the Home page navigation
- `patient-list.spec.ts` - Tests for the Patient List page navigation
- `patient-detail.spec.ts` - Tests for the Patient Detail page navigation
- `patient-analytics.spec.ts` - Tests for the Analytics page navigation
- `how-to.spec.ts` - Tests for the How-To page navigation
- `navigation.spec.ts` - Tests for navigation between pages

## Running Tests

```bash
# Run all tests
npm test

# Run tests in UI mode
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Run specific test file
npm test -- home.spec.ts

# Show test report
npm run test:report
```

## Configuration

Tests are configured in `playwright.config.ts` and will:
- Automatically start the Vite dev server
- Run tests against `http://localhost:5173`
- Generate HTML reports on test completion
- Take screenshots on failure
- Record traces on first retry

## Current Test Coverage

The tests currently focus on:
- **Navigation**: Verifying that each page route loads successfully
- **Page Loading**: Ensuring pages load without errors
- **URL Validation**: Confirming correct routing behavior

## Known Limitations

**Important**: The application loads MUI (Material-UI) components from a CDN (esm.sh). In the test environment, these CDN resources may not load properly due to network restrictions, causing UI components to not render. Therefore, the current tests focus on:

1. Navigation and routing functionality
2. Basic page load validation
3. API mocking setup

The tests do **not** currently validate:
- Specific UI component interactions (buttons, forms, dropdowns)
- Visual elements and styling
- Interactive features (clicking, typing, selecting)

## Future Improvements

To enable full UI testing, consider:
1. Installing MUI as an npm dependency instead of loading from CDN
2. Adding integration tests that run against a fully deployed environment
3. Implementing visual regression testing for rendered components
4. Adding accessibility (a11y) tests for keyboard navigation and screen readers

## Notes

- Tests use API mocking to avoid requiring a live backend server
- Longer timeouts (30s) are used for page loads to account for CDN resources
- Tests are designed to be resilient to timing issues and network delays
