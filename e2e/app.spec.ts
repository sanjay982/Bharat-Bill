import { test, expect } from '@playwright/test';

test('app loads and shows login or dashboard', async ({ page }) => {
  await page.goto('/');

  // Check if we are on the login page or dashboard
  // The app might show "Sign in to your account" or "Dashboard"
  // Wait for network idle to ensure page is loaded
  await page.waitForLoadState('networkidle');
  
  const bodyText = await page.locator('body').textContent();
  
  if (bodyText?.includes('Johar Billing')) {
    // Landing page
    await expect(page.locator('text=Johar Billing').first()).toBeVisible();
  } else if (bodyText?.includes('Sign In')) {
    // Login page
    await expect(page.locator('input[type="email"]')).toBeVisible();
  } else {
    // Dashboard (if auto-logged in)
    await expect(page.locator('text=Dashboard').first()).toBeVisible();
  }
});
