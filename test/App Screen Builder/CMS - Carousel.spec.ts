//npx playwright test "test/App Screen Builder/CMS - Carousel.spec.ts" --headed 
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


test('App Screen Builder - Section Tabs Option', async ({ page }) => {
  // Navigate to the login page..
await page.goto('https://cms.gc.uzgc2.com/');
await page.getByRole('textbox', { name: 'Email * Email *' }).fill(email);
await page.getByRole('textbox', { name: 'Password * Password *' }).fill(password);
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('link', { name: 'Pages' }).click();
await expect(page.locator('#app-screens')).toBeVisible();
await page.locator('#app-screens').click();
await page.locator('[id="__nuxt"]').getByText('Automation Content').click();
await page.getByRole('button', { name: 'Edit' }).click();

// Add New Section
await page.getByText('Add Section').nth(1).click();

// Add Section Title
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).click();
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).fill('Carousel');

// Save Newly created section
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(5000);

// Hover over the section that contains the hidden button group
const sectionContainer = page.locator('.group\\/section'); // or use an exact parent container if possible
await sectionContainer.nth(1).hover(); // Adjust the index as needed

// Click the revealed "+ Tabs" button after hover
await page.getByRole('button', { name: 'Tabs' }).nth(1).click();

// Verify that "Tab One" is visible in the list
await expect(page.getByRole('list').getByText('Tab One')).toBeVisible();

// Confirm the list contains "Tab One"
await expect(page.getByRole('list')).toContainText('Tab One');

// Confirm the list contains "Tab Two"
await expect(page.getByRole('list')).toContainText('Tab Two');
await page.locator('div:nth-child(2) > .relative > div > .flex > button').first().click();
await expect(page.locator('div').filter({ hasText: /^Tab Two$/ }).first()).toBeVisible();

// Rename tab
await page.getByRole('textbox', { name: 'Enter tab title...' }).click();
await page.getByRole('textbox', { name: 'Enter tab title...' }).fill('Automation Tab 2');
await expect(page.getByRole('list').getByText('Automation Tab 2')).toBeVisible();

// Move Tab Left 
await page.locator('div:nth-child(2) > .relative > div > .flex > button').first().click();
await expect(page.locator('div').filter({ hasText: /^Automation Tab 2$/ }).first()).toBeVisible();

//Move Tab Right
await page.locator('.transition > .flex > button:nth-child(2)').first().click();
await expect(page.locator('div').filter({ hasText: /^Automation Tab 2$/ }).first()).toBeVisible();

// Delete Tab
await page.locator('.z-30 > .flex > .gc-base-icon > svg > use').click();
await page.locator('div').filter({ hasText: /^Tab Three$/ }).first().click();
await page.locator('div:nth-child(3) > .relative > div > .flex > button:nth-child(4)').click();
await page.locator('.z-30 > .flex > .gc-base-icon > svg > use').click();
await page.locator('div').filter({ hasText: /^Tab Three$/ }).first().click();
await page.locator('div:nth-child(3) > .relative > div > .flex > button:nth-child(4)').click();
await expect(page.locator('div').filter({ hasText: /^Tab Three$/ }).first()).not.toBeVisible()

// Save Newly created section
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(5000);
});

test('App Screen Builder - Add News Content', async ({ page }) => {
  // Navigate to the login page
await page.goto('https://cms.gc.uzgc2.com/');
await page.getByRole('textbox', { name: 'Email * Email *' }).fill(email);
await page.getByRole('textbox', { name: 'Password * Password *' }).fill(password);
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('link', { name: 'Pages' }).click();
await expect(page.locator('#app-screens')).toBeVisible();
await page.locator('#app-screens').click();
await page.locator('[id="__nuxt"]').getByText('Automation Content').click();
await page.getByRole('button', { name: 'Edit' }).click();
await page.pause();

});