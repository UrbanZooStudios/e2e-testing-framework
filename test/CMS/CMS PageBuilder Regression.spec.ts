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


test('Regression - Page Builder Creation', async ({ page }) => {
// Navigate to the login page
await page.goto('https://cms.gc.uzstaging1.co.uk/');

// Fill in the email field
await page.getByRole('textbox', { name: 'Email * Email *' }).fill(email);

// Fill in the password field
await page.getByRole('textbox', { name: 'Password * Password *' }).fill(password);

// Click the "Sign in" button
await page.getByRole('button', { name: 'Sign in' }).click();

// Click on the "Pages" section
await page.getByRole('link', { name: 'Pages' }).click();

// Click on "Edit pages"
await page.getByRole('link', { name: 'Edit pages' }).click();

// Select the "Automation" page from the list
await page.locator('a').filter({ hasText: 'Automation' }).click();

// Assertions to confirm page loaded successfully
await expect(page.locator('[id="__nuxt"]')).toContainText('Automation');
await expect(page.locator('a').filter({ hasText: 'Automation' })).toBeVisible();
await expect(page.getByRole('heading', { name: 'Automation' })).toBeVisible();
await expect(page.locator('h1')).toContainText('Automation');
await expect(page.locator('[id="__nuxt"]')).toContainText('Create New Page');


// Click on the "Create New Page" button (or similar element)
// List of possible page locators (these may vary per ENV)
const pageLocators = [
    '#page-0-a718989a-9d5d-4f72-9171-72e3030b4f16 > div > .relative > .grid > .flex',
    '#page-0-02359036-58bf-4077-9dcf-2e9ae85c9702 > div > div > .grid > .flex'
  ];
  
  let clicked = false;
  
  for (const selector of pageLocators) {
    const locator = page.locator(selector);
    if (await locator.count() > 0 && await locator.isVisible()) {
      await locator.click();
      clicked = true;
      break;
    }
  }
  
  if (!clicked) {
    throw new Error('No valid page locator found to click.');
  }


// Double-click the textbox to activate it
await page.getByRole('textbox', { name: 'Enter Page Name' }).dblclick();

// Format today's date as YYYY/MM/DD
const today = new Date();
const formattedDate = `${today.getFullYear()}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}`;
console.log(`Filling date: ${formattedDate}`); // Log the date for debugging

// Fill the page name input with the formatted date
const input = await page.getByRole('textbox', { name: 'Enter Page Name' });
await input.fill(formattedDate);
await input.press('Enter');

// Wait for the page to process the new entry
await page.waitForTimeout(3000);

// Verify that the new page name appears on the page
await expect(page.locator('[id="__nuxt"]')).toContainText(formattedDate);

});

test('Regression - Page Settings', async ({ page }) => {
    // Navigate to the login page
    await page.goto('https://cms.gc.uzstaging1.co.uk/');

// Enter email and password for authentication
await page.getByRole('textbox', { name: 'Email * Email *' }).fill(email);
await page.getByRole('textbox', { name: 'Password * Password *' }).fill(password);

    await page.getByRole('button', { name: 'Sign in' }).click();
// Navigate to Pages and Edit Section
    await page.getByRole('link', { name: 'Pages' }).click();
    await page.getByRole('link', { name: 'Edit pages' }).click();
    await page.locator('a').filter({ hasText: 'Automation +' }).hover();
    const tab = page.locator('a').filter({ hasText: 'Automation +' });
    await tab.hover();
    await expect(tab).toHaveClass(/hovered|active|highlight/); // adjust regex
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
    await page.waitForTimeout(10000);
    await settingsButton.dblclick();
    await settingsButton.click();

    await page.getByRole('textbox', { name: 'Page Title Slug Amend how the' }).fill(expectedText);
    await page.locator('#inputLabel').nth(1).click();
// Update External URL
    await page.locator('#inputLabel').nth(2).click();
    await page.locator('#inputLabel').nth(2).fill('https://test.com')

//Update Third-Party-Scripts
    await page.locator('#inputLabel').nth(4).click();
    await page.locator('#inputLabel').nth(4).fill('This is a third party script');
    await expect(page.locator('#inputLabel').nth(4)).toBeVisible();

// Update Select Apply URL
    await page.getByRole('button', { name: 'Apply' }).click();
    await page.locator('#inputLabel').nth(1).click();
    await page.getByRole('button', { name: 'Apply' }).click();
    await page.getByRole('button', { name: 'Done' }).click();
});

test('Regression - Page Management', async ({ page }) => {
    // Navigate to the CMS login page
    await page.goto('https://cms.gc.uzstaging1.co.uk/');

    // Fill in login credentials and sign in
    await page.getByRole('textbox', { name: 'Email * Email *' }).fill(email);
    await page.getByRole('textbox', { name: 'Password * Password *' }).fill(password);
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Navigate to the 'Pages' section and then to 'Edit pages'
    await page.getByRole('link', { name: 'Pages' }).click();
    await page.getByRole('link', { name: 'Edit pages' }).click();

    // Hover over the 'Automation +' tab to ensure it highlights correctly
    const tab = page.locator('a').filter({ hasText: 'Automation +' });
    await tab.hover();

    // Validate the tab is visually highlighted (adjust class regex as needed)
    await expect(tab).toHaveClass(/hovered|active|highlight/);

    // Click on the 'Automation +' tab
    await tab.click();

    // Generate today's date in yyyy/mm/dd format for dynamic content validation
    const today = new Date();
    const formattedDate = `${today.getFullYear()}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}`;
    const expectedText = `${formattedDate} - Updated`;
    console.log(`Searching for date: ${formattedDate}`);

    // Locate and click the first link that contains today's formatted date
    await page.locator(`a:has-text("${formattedDate}")`).first().click();

    // Open the Settings panel for the selected page
    const settingsButton = page.locator('button.gc-button:has-text("Settings")');
    await page.waitForTimeout(10000);
    await settingsButton.dblclick();

    // Validate visibility of various summary-related content in the settings
    await expect(page.getByText('Summary', { exact: true })).toBeVisible();
    await expect(page.locator('[id="__nuxt"]')).toContainText('Summary');
    await expect(page.getByText('Enter a brief summary, this')).toBeVisible();
    await expect(page.locator('[id="__nuxt"]')).toContainText('Enter a brief summary, this displays when linking to an internal page on an internal card.');

    // Fill in the summary input field with an automated message
    await expect(page.locator('#inputLabel').nth(3)).toBeVisible();
    await page.locator('#inputLabel').nth(3).click();
    await page.locator('#inputLabel').nth(3).fill('This is an automated message using Playwright');

    // Select 'Page Management' from the list to categorize the update
    await page.getByRole('listitem').filter({ hasText: 'Page Management' }).click();

    // Apply changes and close the settings dialog
    await page.getByRole('button', { name: 'Apply' }).click();
    await page.getByRole('button', { name: 'Done' }).click();
});

test('Regression - Edit Page Content', async ({ page }) => {
    // Navigate to the CMS login page
    await page.goto('https://cms.gc.uzstaging1.co.uk/');

    // Fill in login credentials and sign in
    await page.getByRole('textbox', { name: 'Email * Email *' }).fill(email);
    await page.getByRole('textbox', { name: 'Password * Password *' }).fill(password);
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Navigate to the 'Pages' section and then to 'Edit pages'
    await page.getByRole('link', { name: 'Pages' }).click();
    await page.getByRole('link', { name: 'Edit pages' }).click();

    // Hover over the 'Automation +' tab to ensure it highlights correctly
    const tab = page.locator('a').filter({ hasText: 'Automation +' });
    await tab.hover();

    // Validate the tab is visually highlighted (adjust class regex as needed)
    await expect(tab).toHaveClass(/hovered|active|highlight/);

    // Click on the 'Automation +' tab
    await tab.click();

    // Generate today's date in yyyy/mm/dd format for dynamic content validation
    const today = new Date();
    const formattedDate = `${today.getFullYear()}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}`;
    const expectedText = `${formattedDate} - Updated`;
    console.log(`Searching for date: ${formattedDate}`);

    // Locate and click the first link that contains today's formatted date
    await page.locator(`a:has-text("${formattedDate}")`).first().click();

// Click the 'Edit' button to open the page editor
await page.getByRole('button', { name: 'Edit' }).click();

// Verify that the 'Content' section is visible in the editor
//await expect(page.getByText('Content')).toBeVisible();

// Confirm that 'Content' text is present within the main Nuxt container
await expect(page.locator('[id="__nuxt"]')).toContainText('Content');

// Confirm that 'Style' tab or section is also present
await expect(page.locator('[id="__nuxt"]')).toContainText('Style');
await page.waitForTimeout(5000);

// Check that the 'New Section' button is visible, indicating the editor loaded correctly
await expect(page.getByRole('button', { name: 'New Section' })).toBeVisible();
await page.waitForTimeout(5000);

//Select content section of the page
await page.getByRole('button', { name: 'New Section' }).click();
await page.waitForTimeout(5000);

// Verify that the root element with id "__nuxt" contains the text 'Section'
await expect(page.locator('[id="__nuxt"]')).toContainText('Section');
await page.waitForTimeout(5000);

// Verify that the 'Section' heading (inside a <span>) is visible
await expect(page.getByRole('heading', { name: 'Section' }).locator('span')).toBeVisible();

// Again verify that the root element contains the text 'Section' (redundant unless needed for different state check)
await expect(page.locator('[id="__nuxt"]')).toContainText('Section');
await page.waitForTimeout(5000);

// Verify that the heading with name 'Title and Buttons' is visible
await expect(page.getByRole('heading', { name: 'Title and Buttons' })).toBeVisible();
});


test('Regression - Page Options', async ({ page }) => {
    // Navigate to the CMS login page
    await page.goto('https://cms.gc.uzstaging1.co.uk/');

    // Fill in login credentials and sign in
    await page.getByRole('textbox', { name: 'Email * Email *' }).fill(email);
    await page.getByRole('textbox', { name: 'Password * Password *' }).fill(password);
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Navigate to the 'Pages' section and then to 'Edit pages'
    await page.getByRole('link', { name: 'Pages' }).click();
    await page.getByRole('link', { name: 'Edit pages' }).click();

    // Hover over the 'Automation +' tab to ensure it highlights correctly
    const tab = page.locator('a').filter({ hasText: 'Automation +' });
    await tab.hover();

    // Validate the tab is visually highlighted (adjust class regex as needed)
    await expect(tab).toHaveClass(/hovered|active|highlight/);

    // Click on the 'Automation +' tab
    await tab.click();

    // Generate today's date in yyyy/mm/dd format for dynamic content validation
    const today = new Date();
    const formattedDate = `${today.getFullYear()}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}`;
    const expectedText = `${formattedDate} - Updated`;
    console.log(`Searching for date: ${formattedDate}`);

    // Locate and click the first link that contains today's formatted date
    await page.locator(`a:has-text("${formattedDate}")`).first().click();

// Click on the 'Add Page' button to create a new child page under a parent page
await page.getByText('Create New Page').nth(2).click();

// Fill in the page name with 'Child Page' in the textbox
await page.getByRole('textbox', { name: 'Enter Page Name' }).fill('Child Page');

// Press 'Enter' to submit and create the new child page
await page.getByRole('textbox', { name: 'Enter Page Name' }).press('Enter');

// Wait for 1 second to allow the new page to be added (temporary wait; better to replace with proper wait)
await page.waitForTimeout(1000);

// Verify that the first link element containing the text 'Child Page' is visible on the page
await expect(page.locator('a').filter({ hasText: 'Child Page' }).first()).toBeVisible();

await page.waitForTimeout(1000);

// Click on the 'Settings' button to open the page settings menu
await page.getByRole('button', { name: 'Settings' }).click();

// Click on the 'Delete Page' button to initiate the page deletion process
await page.getByRole('button', { name: 'Delete Page' }).click();

// Confirm the deletion by clicking the exact 'Delete' button in the confirmation dialog
await page.getByRole('button', { name: 'Delete', exact: true }).click();

});

