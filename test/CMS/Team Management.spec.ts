//npx playwright test "test/PageBuilder/Team Management.spec.ts" --headed

import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

// Fetch environment variables for authentication
const email = process.env.UZGC2_EMAIL;
const password = process.env.UZGC2_PASSWORD;
const testEmail = process.env.UZGC2_TEST_EMAIL;
const testPassword = process.env.UZGC2_TEST_PASSWORD;

// Validate that the required environment variables are set
if (!email || !password) {
  throw new Error("Main login Email or Password is not set in environment variables.");
}
if (!testEmail || !testPassword) {
  throw new Error("Test Email or Test Password is not set in environment variables.");
}

test('Player Sponsors > Team Management > Current Squad ', async ({ page }) => {
    
// Navigate to the login page
await page.goto('https://cms.gc.uzgc2.com/login');
//await page.goto('https://cms.gc.uzstaging1.co.uk/login');
await page.getByRole('textbox', { name: 'Email * Email *' }).fill(email);
await page.getByRole('textbox', { name: 'Password * Password *' }).fill(password);
await page.getByRole('button', { name: 'Sign in' }).click();

// Access CMS > Team Management
await page.getByRole('link', { name: 'Team Management' }).click();
await page.waitForTimeout(5000);

// Select Manage Squads
await expect(page.getByRole('link', { name: 'Manage Squads' })).toBeVisible();
await expect(page.locator('body')).toContainText('Manage Squads');
await page.getByRole('link', { name: 'Manage Squads' }).click();

// Click current squad tab
await expect(page.locator('body')).toContainText('Current Squad');


// Select the player using the actions icon
await page.getByRole('row', { name: 'Custom d45c2670-29f5-11ef-' }).getByRole('button').click();

// Select “Player Sponsors,” upload an image, and click “Save.
await page.locator('div:nth-child(12) > .mdi-plus-circle-outline').click();

// Select Add New Sponsor button 
await expect(page.getByRole('heading', { name: 'Player Sponsors' })).toBeVisible();
await expect(page.locator('body')).toContainText('Add New Sponsor');

// Select Open Media Library & search for image > Click image and click add then save
await page.getByRole('button', { name: 'Open Media library' }).click();
await page.getByRole('textbox', { name: 'Search the library' }).fill('sponsor');
await page.getByRole('button', { name: 'Search' }).click();
await page.waitForTimeout(5000);
await page.pause();
await page.getByRole('article').filter({ hasText: 'png-transparent-coke-logo-' }).getByRole('button').first().click();
await page.getByRole('button', { name: 'Add', exact: true }).click();
await page.getByRole('button', { name: 'Save' }).click();


// Access Fanside and select the “Teams” option from the top navigation bar
// Locate the player and verify that the main card displays the correct sponsors
// Click the player profile and verify that the correct sponsors are displayed.
// Click the sponsor link and verify that the page redirects correctly
// Click the player profile link and verify that the page redirects correctly

});