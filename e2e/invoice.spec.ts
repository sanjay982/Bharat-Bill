import { test, expect } from '@playwright/test';

test.describe('Invoice Management Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app and log in
    await page.goto('/');

    // Check if landing page is visible and click Login
    // We use .first() because there might be multiple "Login" texts or buttons, 
    // but the nav button is usually first or we can target specific class if needed.
    // Better to target the specific button in the nav.
    const getStartedButton = page.locator('button:has-text("Get Started Free")');
    if (await getStartedButton.isVisible()) {
      await getStartedButton.click();
    }

    await page.fill('input[type="email"]', 'sanju13july@gmail.com');
    await page.fill('input[type="password"]', 'Admin');
    await page.click('button:has-text("Sign In")');

    // Wait for dashboard to load
    await expect(page.locator('text=Revenue Overview')).toBeVisible();
  });

  test('can navigate to invoices and open new invoice modal', async ({ page }) => {
    // Navigate to Invoices
    await page.click('button:has-text("Invoices")');

    // Verify we are on the Invoices page
    await expect(page.locator('h2:has-text("Invoices")')).toBeVisible();

    // Click New Invoice button
    await page.click('button:has-text("New Invoice")');

    // Verify the modal opens
    await expect(page.locator('text=Create New Invoice')).toBeVisible();

    // Close the modal
    await page.click('button:has-text("Cancel")');
    
    // Verify modal is closed
    await expect(page.locator('text=Create New Invoice')).not.toBeVisible();
  });
});
