//npx playwright test "test/CMS/CMS PageBuilder Regression.spec" --headed

import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

// Fetch environment variables for authentication
const email = process.env.PLAYWRIGHT_EMAIL;
const password = process.env.PLAYWRIGHT_PASSWORD;
const testEmail = process.env.PLAYWRIGHT_TEST_EMAIL;
const testPassword = process.env.PLAYWRIGHT_TEST_PASSWORD;

// Validate that the required environment variables are set
if (!email || !password) {
  throw new Error("Main login Email or Password is not set in environment variables.");
}
if (!testEmail || !testPassword) {
  throw new Error("Test Email or Test Password is not set in environment variables.");
}


test('CMS - App Screen Builder Validation', async ({ page }) => {
// Navigate to the login page
await page.goto('https://cms.gc.uzstaging1.co.uk/');

// Fill in the email field
await page.getByRole('textbox', { name: 'Email * Email *' }).fill(email);

// Fill in the password field
await page.getByRole('textbox', { name: 'Password * Password *' }).fill(password);

// Click the "Sign in" button
await page.getByRole('button', { name: 'Sign in' }).click();

});
