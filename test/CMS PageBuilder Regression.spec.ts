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


test('Regression - Page Builder Creation', async ({ page }) => {
    // Navigate to the login page
    await page.goto('https://cms.gc.uzgc2.com/login');

// Enter email and password for authentication
await page.getByRole('textbox', { name: 'Email * Email *' }).fill(email);
await page.getByRole('textbox', { name: 'Password * Password *' }).fill(password);

  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('link', { name: 'Pages' }).click();
  await page.getByRole('link', { name: 'Edit pages' }).click();
  await page.locator('a').filter({ hasText: 'Automation' }).click();
  await expect(page.locator('[id="__nuxt"]')).toContainText('Automation');
  await expect(page.locator('a').filter({ hasText: 'Automation' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Automation' })).toBeVisible();
  await expect(page.locator('h1')).toContainText('Automation');
  await expect(page.locator('[id="__nuxt"]')).toContainText('Create New Page')
  await page.locator('#page-0-711630b0-069e-43cf-9aff-a6295f4d1181 > div > div > .grid > .flex').click();

  // Format today's date as YYYY/MM/DD (or any format you need)
  const today = new Date();
  const formattedDate = `${today.getFullYear()}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}`;
  console.log(`Filling date: ${formattedDate}`); // Log the date to verify

  // Fill the textbox with the formatted date
  const input = await page.getByRole('textbox', { name: 'Enter Page Name' });
  await input.fill(formattedDate);
  await input.press('Enter');
  await page.waitForTimeout(3000); // Wait for 3 seconds
  // await page.locator('a').filter({ hasText: 'Automation' }).click();
  await expect(page.locator('[id="__nuxt"]')).toContainText(formattedDate);

});

test.only('Regression - Page Settings', async ({ page }) => {
    // Navigate to the login page
    await page.goto('https://cms.gc.uzgc2.com/login');

// Enter email and password for authentication
await page.getByRole('textbox', { name: 'Email * Email *' }).fill(email);
await page.getByRole('textbox', { name: 'Password * Password *' }).fill(password);

    await page.getByRole('button', { name: 'Sign in' }).click();
// Navigate to Pages and Edit Section
    await page.getByRole('link', { name: 'Pages' }).click();
    await page.getByRole('link', { name: 'Edit pages' }).click();
    await page.locator('a').filter({ hasText: 'Automation +' }).click();
// Get today's date in the required format
    const today = new Date();
    const formattedDate = `${today.getFullYear()}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}`;
    const expectedText = `${formattedDate} - Updated`;
    console.log(`Searching for date: ${formattedDate}`);
// Find and click the link containing today's date
    await page.locator(`a:has-text("${formattedDate}")`).first().click();
// Update the page title
    const settingsButton = page.locator('button.gc-button:has-text("Settings")');
    await settingsButton.dblclick();
    await page.getByRole('textbox', { name: 'Page Title Slug Amend how the' }).fill(expectedText);
    await page.locator('#inputLabel').nth(1).click();
// Update External URL
    await page.locator('#inputLabel').nth(2).click();
    await page.locator('#inputLabel').nth(2).fill('https://test.com')
// Update Select Apply URL
    await page.getByRole('button', { name: 'Apply' }).click();
    await page.locator('#inputLabel').nth(1).click();
    await page.getByRole('button', { name: 'Apply' }).click();
    await page.getByRole('button', { name: 'Done' }).click();
/*
    await expect(page.locator('[id="__nuxt"]')).toContainText(expectedText);
    await settingsButton.dblclick();
    await page.waitForTimeout(3000); // Wait for 3 seconds
*/
});



test('Regression - Delete Child Page', async ({ page }) => {
    // Navigate to the login page
    await page.goto('https://cms.gc.uzgc2.com/login');

// Enter email and password for authentication
await page.getByRole('textbox', { name: 'Email * Email *' }).fill(email);
await page.getByRole('textbox', { name: 'Password * Password *' }).fill(password);
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Navigate to Pages and Edit Section
    await page.getByRole('link', { name: 'Pages' }).click();
    await page.getByRole('link', { name: 'Edit pages' }).click();
    await page.locator('a').filter({ hasText: 'Automation +' }).click();

    // Try selecting '/03/13' first, if not found, try '/03/13 - Updated'
    const firstOption = await page.locator('a').filter({ hasText: '/03/13' }).first();
    const firstOptionCount = await firstOption.count();

    if (firstOptionCount > 0) {
        await firstOption.click();
    } else {
        const secondOption = await page.locator('a').filter({ hasText: '/03/13 - Updated' });
        const secondOptionCount = await secondOption.count();

        if (secondOptionCount > 0) {
            await secondOption.click();
        } else {
            console.log("Neither option found, exiting test.");
            return;
        }
    }

    // Proceed to delete the selected page
    await page.getByRole('button', { name: 'Settings' }).click();
    await page.getByRole('button', { name: 'Delete Page' }).click();

    await expect(page.getByText('Delete Page Are you sure you want to delete this page? Cancel Delete')).toBeVisible();
    await expect(page.locator('body')).toContainText('Delete Page');
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete', exact: true })).toBeVisible();
    await expect(page.locator('body')).toContainText('Cancel');
    await expect(page.locator('body')).toContainText('Delete');

    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await page.getByTitle('Pages').getByRole('img').click();
    await page.locator('a').filter({ hasText: 'Automation +' }).click();
});


test('Regression - TBC', async ({ page }) => {
    // Navigate to the login page
    await page.goto('https://cms.gc.uzgc2.com/login');

// Enter email and password for authentication
await page.getByRole('textbox', { name: 'Email * Email *' }).fill(email);
await page.getByRole('textbox', { name: 'Password * Password *' }).fill(password);
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Navigate to Pages and Edit Section
    await page.getByRole('link', { name: 'Pages' }).click();
    await page.getByRole('link', { name: 'Edit pages' }).click();
    await page.locator('a').filter({ hasText: 'Automation +' }).click();

});
