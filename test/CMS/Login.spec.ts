// npx playwright test "test/CMS/Login.spec.ts" --headed
import { test, expect } from '@playwright/test';
import { getCredentials } from '../Utils/getCredentials';

const { email, password, testEmail, testPassword } = getCredentials();

//const loginUrl = 'https://cms.gc.uzgc2.com/login';
const loginUrl = 'https://cms.gc.gc2stagingservices.co.uk/'

test.beforeEach(async ({ page }) => {
  await page.goto(loginUrl);
});

test('Login flow', async ({ page }) => {
  await page.getByRole('textbox', { name: 'Email * Email *' }).fill("admin@urbanzoo.io");
  await page.getByRole('textbox', { name: 'Password * Password *' }).fill("?+C:mL8FD46#'up]4w");
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

//Skipped until - UZ-3364
test('Forgotten Password Flow', async ({ page }) => {
  await page.getByRole('link', { name: 'Forgotten password?' }).click();

  await expect(page.getByRole('img', { name: 'Gamechanger' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Email * Email *' })).toBeVisible();
  await expect(page.locator('form div').filter({ hasText: 'Send Reset Code' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Email * Email *' }).fill(process.env.PLAYWRIGHT_TEST_EMAIL!);
  await page.getByRole('button', { name: 'Send Reset Code' }).click();

  await page.waitForTimeout(3000); // Consider replacing with waitForSelector when possible

  await expect(page.getByRole('heading', { name: 'Reset Password' })).toBeVisible();
  await expect(page.getByRole('paragraph')).toContainText('Your password has been reset');
  await expect(page.getByText('Your password has been reset')).toBeVisible();

  await page.getByRole('textbox', { name: 'Email * Email *' }).fill(process.env.PLAYWRIGHT_TEST_EMAIL!);
  await page.getByRole('textbox', { name: 'Code Code' }).fill('123456');
  await page.getByRole('textbox', { name: 'Password Password' }).fill("testing1234!");

  await page.getByRole('button', { name: 'Set Password' }).click();
});
