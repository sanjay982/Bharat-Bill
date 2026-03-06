import { test, expect } from '@playwright/test';

test('app loads and shows login or dashboard', async ({ page }) => {
  await page.goto('/');

  // Check if we are on the login page or dashboard
  // The app might show "Sign in to your account" or "Dashboard"
  const bodyText = await page.locator('body').textContent();
  
  if (bodyText?.includes('Sign in to your account')) {
    await expect(page.locator('text=Sign in to your account')).toBeVisible();
  } else {
    // If it auto-logs in or skips login
    await expect(page.locator('text=Dashboard').first()).toBeVisible();
  }
});
