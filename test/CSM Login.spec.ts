import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();


// Fetch environment variables
const email = process.env.PLAYWRIGHT_EMAIL;
const password = process.env.PLAYWRIGHT_PASSWORD;
const testEmail = process.env.PLAYWRIGHT_TEST_EMAIL;
const testPassword = process.env.PLAYWRIGHT_TEST_PASSWORD;

// Validate environment variables
if (!email || !password) {
  throw new Error("Main login Email or Password is not set in environment variables.");
}
if (!testEmail || !testPassword) {
  throw new Error("Test Email or Test Password is not set in environment variables.");
}

test('Login flow', async ({ page }) => {
  await page.goto('https://cms.gc.uzgc2.com/login');

  await page.getByRole('textbox', { name: 'Email * Email *' }).fill(email);
  await page.getByRole('textbox', { name: 'Password * Password *' }).fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Ensure successful login by verifying a navigation element
  await expect(page.getByRole('navigation').getByRole('img')).toBeVisible();
});

test('UI Validation', async ({ page }) => {
  await page.goto('https://cms.gc.uzgc2.com/login');
  await expect(page.getByRole('img', { name: 'Gamechanger' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Email * Email *' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Password * Password *' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Forgotten password?' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
});

test('Forgotten Password Flow', async ({ page }) => {
  await page.goto('https://cms.gc.uzgc2.com/login');
  await page.getByRole('link', { name: 'Forgotten password?' }).click();

  await expect(page.getByRole('img', { name: 'Gamechanger' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Email * Email *' })).toBeVisible();
  await expect(page.locator('form div').filter({ hasText: 'Send Reset Code' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Email * Email *' }).fill(testEmail);
  await expect(page.getByRole('button', { name: 'Send Reset Code' })).toBeVisible();
  await page.getByRole('button', { name: 'Send Reset Code' }).click();

  await expect(page.getByRole('heading', { name: 'Reset Password' })).toBeVisible();
  await expect(page.getByRole('paragraph')).toContainText('Your password has been reset, please use the code sent to your email address to set a new password.');
  await expect(page.getByText('Your password has been reset')).toBeVisible();

  await expect(page.getByRole('textbox', { name: 'Email Address Email Address' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Code Code' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Password Password' })).toBeVisible();
  await expect(page.locator('form div').filter({ hasText: 'Set Password' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Email Address Email Address' }).fill(testEmail);
  await page.getByRole('textbox', { name: 'Code Code' }).fill('123456');
  await page.getByRole('textbox', { name: 'Password Password' }).fill(testPassword);

  await expect(page.getByRole('button', { name: 'Set Password' })).toBeVisible();
  await page.getByRole('button', { name: 'Set Password' }).click();
});