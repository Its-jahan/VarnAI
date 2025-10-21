import { test, expect } from '@playwright/test';

test('home redirects to dashboard placeholder', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/dashboard/);
});
