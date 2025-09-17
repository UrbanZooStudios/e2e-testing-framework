//npx playwright test "test/CMS/CMS Ads.spec.ts" --headed

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
    //await page.goto('https://cms.gc.uzgc2.com/login');
    await page.goto('https://cms.gc.gc2stagingservices.co.uk/');

    // Enter email and password for authentication
    await page.getByRole('textbox', { name: 'Email * Email *' }).fill(email);
    await page.getByRole('textbox', { name: 'Password * Password *' }).fill("?+C:mL8FD46#'up]4w");

    // Click the "Sign in" button
    await page.getByRole('button', { name: 'Sign in' }).click();
  // Sign in
// Navigate to the 'Advertising' section
await page.getByRole('listbox').getByRole('link', { name: 'Advertising' }).click();

// Click on the 'Create New Advert' button
await page.getByRole('button', { name: 'Create New Advert' }).click();

// Fill in the campaign name
await page.getByRole('textbox', { name: 'Campaign Name' }).click();
await page.getByRole('textbox', { name: 'Campaign Name' }).fill('QA Test');

// Select the first image slot to upload an image
await page.locator('.image-uploader__image-container').first().click();

// Select and add an image from the list (first one that matches the text)
await page.getByRole('article').filter({ hasText: '1920x1080_2024-10-' }).getByRole('button').first().click();
await page.getByRole('button', { name: 'Add' }).click();

// Click to add another image
await page.locator('.image-uploader__image-container > .mdi-plus').click();

// Select and add another image
await page.getByRole('article').filter({ hasText: '1920x1080_2024-10-' }).getByRole('button').first().click();
await page.getByRole('button', { name: 'Add' }).click();

// Fill in the advert title
await page.getByRole('textbox', { name: 'Title' }).click();
await page.getByRole('textbox', { name: 'Title' }).fill('QA Test');

// Select a value from dropdown (e.g. Child-appropriate flag)
await page.locator('div:nth-child(8) > .v-input__control > .v-field > .v-field__field > .v-field__input').click();
await page.getByText('No, this advert is not child').click();

// Fill in the target URL
await page.getByRole('textbox', { name: 'URL (full URL)' }).click();
await page.getByRole('textbox', { name: 'URL (full URL)' }).fill('https://google.com');

// Save the advert
await page.getByRole('button', { name: 'Save' }).click();
});