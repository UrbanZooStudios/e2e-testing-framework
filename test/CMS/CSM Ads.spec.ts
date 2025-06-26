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

test('Add Advertising', async ({ page }) => {
    
    // Navigate to the login page
    await page.goto('https://cms.gc.uzgc2.com/login');

    // Enter email and password for authentication
    await page.getByRole('textbox', { name: 'Email * Email *' }).fill(email);
    await page.getByRole('textbox', { name: 'Password * Password *' }).fill(password);

    // Click the "Sign in" button
    await page.getByRole('button', { name: 'Sign in' }).click();
  // Sign in
  await page.getByRole('listbox').getByRole('link', { name: 'Advertising' }).click();
  await page.getByRole('button', { name: 'Create New Advert' }).click();
  await page.getByRole('textbox', { name: 'Campaign Name' }).click();
  await page.getByRole('textbox', { name: 'Campaign Name' }).fill('QA Test');
  await page.locator('.image-uploader__image-container > .mdi-plus').first().click();
  await page.getByRole('article').filter({ hasText: 'GettyImages-' }).getByRole('button').first().click();
  await page.getByRole('button', { name: 'Add' }).click();
  await page.locator('.image-uploader__image-container > .mdi-plus').click();
  await page.getByRole('article').filter({ hasText: '26404040f33bd652a924d7643cecfd34.jpeg' }).getByRole('button').first().click();
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByRole('combobox').filter({ hasText: 'Mobile Container SizeMobile' }).locator('i').click();
  await page.getByText('Banner - 728x90').click();
  await page.getByRole('combobox').filter({ hasText: 'Desktop Container SizeDesktop' }).locator('i').click();
  await page.getByRole('textbox', { name: 'Title' }).click();
  await page.getByRole('textbox', { name: 'Title' }).fill('QA Title ');
  await page.getByRole('combobox').filter({ hasText: /^$/ }).locator('i').click();
  await page.getByText('Yes, this advert is child').click();
  await page.getByRole('textbox', { name: 'URL (full URL)' }).click();
  await page.getByRole('textbox', { name: 'URL (full URL)' }).fill('https://google.co.uk');
  await page.locator('div').filter({ hasText: /^Publish from$/ }).getByLabel('Datepicker input').click();
  await page.getByText('10', { exact: true }).click();
  await page.getByRole('button', { name: 'Select' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('tab', { name: 'Slots' }).click();

});