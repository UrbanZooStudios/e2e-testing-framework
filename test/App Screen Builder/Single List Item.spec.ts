//npx playwright test "test/App Screen Builder/Single List Item.spec.ts" --headed
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

test('App Screen Builder - Single List Item - Upcoming Fixtures', async ({ page }) => {
  // Navigate to the login page..
await page.goto('https://cms.gc.uzgc2.com/');
await page.getByRole('textbox', { name: 'Email * Email *' }).fill(email);
await page.getByRole('textbox', { name: 'Password * Password *' }).fill(password);
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('link', { name: 'Pages' }).click();
await expect(page.locator('#app-screens')).toBeVisible();
await page.locator('#app-screens').click();
await page.locator('[id="__nuxt"]').getByText('Automation - Single List Item').click();
await page.getByRole('button', { name: 'Edit' }).click();

// Add New Section
await page.getByText('Add Section').nth(1).click();

// Click & Add a section Title
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).click();
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).fill('Single List Item ');

// Hover over Menu & select Add single item option
await page.locator('div:nth-child(3) > div > div > div > div > div:nth-child(2) > .pt-0 > div:nth-child(2) > div > .group\\/hover-zone > div > .relative > div:nth-child(2) > .gc-button').click();

// Validate Single Items Option of News,Video,Fixture
await expect(page.getByRole('listitem').filter({ hasText: 'News' })).toBeVisible();
await expect(page.getByRole('listitem').filter({ hasText: 'Video' })).toBeVisible();
await expect(page.getByRole('listitem').filter({ hasText: 'Fixture' })).toBeVisible();
await expect(page.getByRole('dialog')).toContainText('News');
await expect(page.getByRole('dialog')).toContainText('Video');
await expect(page.getByRole('dialog')).toContainText('Fixture');

// Select Fixture button 
await page.getByRole('listitem').filter({ hasText: 'Fixture' }).click();

// Validate Upcoming & Result options are visbile
await expect(page.locator('div').filter({ hasText: /^Upcoming$/ }).locator('div').nth(3)).toBeVisible();
await expect(page.locator('div').filter({ hasText: /^Result$/ }).locator('div').nth(3)).toBeVisible();

// Click Upcoming Fixture 
await page.locator('div').filter({ hasText: /^Upcoming$/ }).locator('div').nth(3).click();


// Fixture Validation - AutoFill - Season Section - Listing Offset are all visible 
await expect(page.locator('div').filter({ hasText: /^Auto-Fill$/ })).toBeVisible();
await expect(page.getByText('Auto-FillManual Fill')).toBeVisible();
await expect(page.locator('.min-h-40 > div > div:nth-child(2) > .min-w-0 > div > div > .relative').first()).toBeVisible();
await expect(page.getByRole('spinbutton')).toBeVisible();

//Select Add the Canvas has been added 
await page.getByRole('button', { name: 'Add to Canvas' }).click();

// Select Save Option 
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(1000);
await page.locator('button').filter({ hasText: /^Save$/ }).click();
await page.waitForTimeout(2000);

});

test('App Screen Builder - Single List Item - Fixtures - Results', async ({ page }) => {
  // Navigate to the login page..
await page.goto('https://cms.gc.uzgc2.com/');
await page.getByRole('textbox', { name: 'Email * Email *' }).fill(email);
await page.getByRole('textbox', { name: 'Password * Password *' }).fill(password);
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('link', { name: 'Pages' }).click();
await expect(page.locator('#app-screens')).toBeVisible();
await page.locator('#app-screens').click();
await page.locator('[id="__nuxt"]').getByText('Automation - Single List Item').click();
await page.getByRole('button', { name: 'Edit' }).click();

// Hover and select Add single item
await page.locator('div:nth-child(2) > div > div > .group\\/hover-zone > div > .relative > div:nth-child(2) > .gc-button').click();

// Select Fixture button
await page.getByRole('listitem').filter({ hasText: 'Fixture' }).click();

// Select Result
await page.locator('div').filter({ hasText: /^Result$/ }).locator('div').nth(3).click();

await page.waitForTimeout(5000);

// Select Add to canvas
await page.getByRole('button', { name: 'Add to Canvas' }).click();

// Result Validate of the Fixtue Result card
await expect(page.getByRole('list').getByText('Fixture: Result')).toBeVisible();
await expect(page.locator('div:nth-child(4) > div > div > div > .z-\\[1\\]')).toBeVisible();

// Save Content
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(1000);
await page.locator('button').filter({ hasText: /^Save$/ }).click();
await page.waitForTimeout(2000);
});

test('App Screen Builder - Single List Item - News', async ({ page }) => {
  // Navigate to the login page..
await page.goto('https://cms.gc.uzgc2.com/');
await page.getByRole('textbox', { name: 'Email * Email *' }).fill(email);
await page.getByRole('textbox', { name: 'Password * Password *' }).fill(password);
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('link', { name: 'Pages' }).click();
await expect(page.locator('#app-screens')).toBeVisible();
await page.locator('#app-screens').click();
await page.locator('[id="__nuxt"]').getByText('Automation - Single List Item').click();
await page.getByRole('button', { name: 'Edit' }).click();

// Hover and select Add single item
await page.locator('div:nth-child(4) > div > div:nth-child(2) > div > div > .group\\/hover-zone > div > .relative > div:nth-child(2) > .gc-button').click();

// Select News button
await page.locator('.w-\\[194px\\] > div:nth-child(4)').click();
await expect(page.getByText('Query Type').nth(2)).toBeVisible();

// Validate the options dropdown is set to latest
await expect(page.getByRole('dialog')).toContainText('Latest');

//Click Dropdown menu 
await page.locator('.h-full > div:nth-child(2) > div > div > div:nth-child(2) > .min-w-0 > div > div > .relative > div:nth-child(2)').click();

// Validate the Dropdown options
await expect(page.getByRole('listitem').filter({ hasText: 'Featured' }).locator('div')).toBeVisible();
await expect(page.getByRole('listitem').filter({ hasText: 'Latest' }).locator('div')).toBeVisible();
await expect(page.getByRole('listitem').filter({ hasText: 'By Category' }).locator('div')).toBeVisible();

// Select Category option from the dropdown
await page.getByRole('listitem').filter({ hasText: 'By Category' }).locator('div').click();

await page.waitForTimeout(5000);

// Select Add to canvas
await page.getByRole('button', { name: 'Add to Canvas' }).click();

// Result Validate of the news 
await expect(page.locator('div:nth-child(5) > div > div > div > .z-\\[1\\]')).toBeVisible();

// Save Content
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(1000);
await page.locator('button').filter({ hasText: /^Save$/ }).click();
await page.waitForTimeout(2000);
});

test('App Screen Builder - Single List Item - Video', async ({ page }) => {
  // Navigate to the login page..
await page.goto('https://cms.gc.uzgc2.com/');
await page.getByRole('textbox', { name: 'Email * Email *' }).fill(email);
await page.getByRole('textbox', { name: 'Password * Password *' }).fill(password);
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('link', { name: 'Pages' }).click();
await expect(page.locator('#app-screens')).toBeVisible();
await page.locator('#app-screens').click();
await page.locator('[id="__nuxt"]').getByText('Automation - Single List Item').click();
await page.getByRole('button', { name: 'Edit' }).click();

// Hover and select Add single item
await page.locator('.relative > div:nth-child(2) > .gc-button').click();

// Select Video button
await expect(page.getByRole('listitem').filter({ hasText: 'Video' })).toBeVisible();
await page.getByRole('listitem').filter({ hasText: 'Video' }).click();

// Validate the options dropdown is set to latest
await expect(page.getByRole('dialog')).toContainText('Latest');

// Click Dropdown menu 
await page.locator('.h-full > div:nth-child(2) > div > div > div:nth-child(2) > .min-w-0 > div > div > .relative > div:nth-child(2) > .gc-base-icon > svg').click();
await expect(page.locator('.flex > div:nth-child(2) > div:nth-child(2) > div > div > .p-4')).toBeVisible();

// Validate the Dropdown options
await expect(page.getByRole('dialog').getByText('Latest').nth(2)).toBeVisible();

// Select Category option from the dropdown
await page.locator('.h-full > div:nth-child(2) > div > div > div:nth-child(2) > .min-w-0 > div > div > .relative').click();
await expect(page.locator('div:nth-child(2) > div > .grid.gap-2 > div:nth-child(2) > .min-w-0 > .relative.w-full > div > .relative')).toBeVisible();

await page.waitForTimeout(5000);

// Select Add to canvas
await page.getByRole('button', { name: 'Add to Canvas' }).click();

// Validate Video 
await expect(page.locator('.z-\\[1\\]')).toBeVisible();

// Save Content
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(1000);
await page.locator('button').filter({ hasText: /^Save$/ }).click();
await page.waitForTimeout(2000);
});

test('App Screen Builder - Single List Item - Clean Up Script', async ({ page }) => {
  // Navigate to the login page..
await page.goto('https://cms.gc.uzgc2.com/');
await page.getByRole('textbox', { name: 'Email * Email *' }).fill(email);
await page.getByRole('textbox', { name: 'Password * Password *' }).fill(password);
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('link', { name: 'Pages' }).click();
await expect(page.locator('#app-screens')).toBeVisible();
await page.locator('#app-screens').click();
await page.locator('[id="__nuxt"]').getByText('Automation - Single List Item').click();
await page.getByRole('button', { name: 'Edit' }).click();

// Select the Delete option from the menu panel
await page.locator('section').filter({ hasText: 'LayoutContentStyleSection' }).getByRole('button').nth(3).click();

// Save Content
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(1000);
await page.locator('button').filter({ hasText: /^Save$/ }).click();
await page.waitForTimeout(2000);
});