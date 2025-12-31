import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Agentic Wallet/);
  
  // Expect the main header to be visible
  await expect(page.getByText('Agentic Wallet')).toBeVisible();
});
