// npx playwright test "test/CMS/Login.spec.ts" --headed
import { test, expect } from '@playwright/test';


//const loginUrl = 'https://cms.gc.uzgc2.com/login';
const loginUrl = 'https://cms.gc.gc2stagingservices.co.uk/'

test.beforeEach(async ({ page }) => {
  await page.goto(loginUrl);
});

test('Login flow', async ({ page }) => {
  await page.getByRole('textbox', { name: 'Email * Email *' }).fill("automation@urbanzoo.io");
  await page.getByRole('textbox', { name: 'Password * Password *' }).fill('hsP25v9\\\\quT{');
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Ensure successful login
  await expect(page.getByRole('navigation').getByRole('img')).toBeVisible();
});

test('UI Validation', async ({ page }) => {
  await expect(page.getByRole('img', { name: 'Gamechanger' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Email * Email *' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Password * Password *' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Forgotten password?' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
});

