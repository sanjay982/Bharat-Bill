import { test, expect } from '@playwright/test';

test.describe('Tenant Management Flow', () => {
  test('admin can log in and create a new tenant', async ({ page }) => {
    // 1. Navigate to the app
    await page.goto('/');

    // Check if landing page is visible and click Login
    const getStartedButton = page.locator('button:has-text("Get Started Free")');
    if (await getStartedButton.isVisible()) {
      await getStartedButton.click();
    }

    // 2. Log in using the admin bypass credentials
    // Wait for the login form to appear
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await page.fill('input[type="email"]', 'sanju13july@gmail.com');
    await page.fill('input[type="password"]', 'Admin');
    await page.click('button:has-text("Sign In")');

    // 3. Verify successful login by checking for the Dashboard
    await expect(page.locator('text=Revenue Overview')).toBeVisible();

    // 4. Navigate to Tenant Management
    // Click the "Tenants" link in the sidebar
    await page.click('button:has-text("Tenants")');

    // Verify we are on the Tenant Management page
    await expect(page.locator('text=Tenant Management')).toBeVisible();

    // 5. Create a new tenant
    await page.click('button:has-text("New Tenant")');

    // Verify the modal opens
    await expect(page.locator('text=Create New Tenant')).toBeVisible();

    // Fill out the form
    const uniqueTenantName = `Test Corp ${Date.now()}`;
    await page.fill('input[placeholder="e.g. Acme Corp"]', uniqueTenantName);
    await page.fill('input[placeholder="27ABCDE1234F1Z5"]', '27TEST1234F1Z5');
    await page.fill('input[placeholder="contact@business.com"]', 'test@test.com');
    await page.fill('input[placeholder="Enter secure password"]', 'password123');

    // Submit the form
    await page.click('button:has-text("Create Tenant")');

    // 6. Verify the new tenant appears in the list
    await expect(page.locator(`text=${uniqueTenantName}`)).toBeVisible();
  });
});
