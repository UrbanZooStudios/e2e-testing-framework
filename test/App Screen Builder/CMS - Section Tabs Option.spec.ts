//npx playwright test "test/App Screen Builder/CMS - Section Tabs Option.spec" --headed 
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


test('App Screen Builder - Section Tabs', async ({ page }) => {
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
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).fill('App Screen Builder - Section Tabs');

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

// Rename tab to Automation Tab 2
await page.getByRole('textbox', { name: 'Enter tab title...' }).click();
await page.getByRole('textbox', { name: 'Enter tab title...' }).fill('Automation Tab 2');
await page.waitForTimeout(5000);

// Validate the tab name has changed
await expect(page.getByRole('list')).toContainText('Automation Tab 2');

// Move Tab Left 
await page.locator('div:nth-child(2) > .relative > div > .flex > button').first().click();
await expect(page.locator('div').filter({ hasText: /^Automation Tab 2$/ }).first()).toBeVisible();

//Move Tab Right
await page.locator('.transition > .flex > button:nth-child(2)').first().click();
await expect(page.locator('div').filter({ hasText: /^Automation Tab 2$/ }).first()).toBeVisible();

// Add a new tab 
await page.locator('.z-30 > .flex > .gc-base-icon > svg > use').first().click();

// Click a newly created tab "Tab Three"
await page.locator('div').filter({ hasText: /^Tab Three$/ }).first().click();

// Hover over Tab Three and select the delete option
await page.locator('div:nth-child(3) > .relative > div > .flex > button:nth-child(4)').click();

// Validate Automation Tab is still visible
await expect(page.getByText('Automation Tab').first()).toBeVisible();
await expect(page.getByRole('list')).toContainText('Automation Tab 2');

// Delete Section
await page.locator('section').filter({ hasText: 'LayoutContentStyleSection' }).getByRole('button').nth(3).click();

// Save Newly created section
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(5000);
});

test('App Screen Builder - Name Tab', async ({ page }) => {
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
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).fill('App Screen Builder - Name Tab');

// Save Newly created section
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(5000);

// Hover over the section that contains the hidden button group
const sectionContainer = page.locator('.group\\/section'); // or use an exact parent container if possible
await sectionContainer.nth(1).hover(); // Adjust the index as needed

// Click the revealed "+ Tabs" button after hover
await page.getByRole('button', { name: 'Tabs' }).nth(1).click();

// Click Tab 1 & Rename it to Rename Tab 1
await page.getByRole('textbox', { name: 'Enter tab title...' }).click();
await page.getByRole('textbox', { name: 'Enter tab title...' }).fill('Rename Tab 1');
await page.getByRole('button', { name: 'Save' }).click();

// Save the content
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(5000);

// Click Tab 2 & Rename it to Rename Tab 2
await page.locator('div:nth-child(3) > div > div > div').first().click();
await page.locator('section').filter({ hasText: 'LayoutContentStylecomponentTabcomponentTabThemeThemeLight Dark Background' }).getByRole('button').nth(1).click();

// Rename Tab 2 
await page.getByRole('textbox', { name: 'Enter tab title...' }).click();
await page.getByRole('textbox', { name: 'Enter tab title...' }).fill('Rename Tab 2');
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(5000);

// Validate tabs 1 & 2 have been renamed
await expect(page.getByRole('list')).toContainText('Rename Tab 1');
await expect(page.getByRole('list')).toContainText('Rename Tab 2');

//Clean Up Script to fully remove section
await page.locator('[id="__nuxt"] span').filter({ hasText: /^Automation Content$/ }).click();
await page.locator('section').filter({ hasText: 'LayoutContentStyleSection' }).getByRole('button').nth(3).click();

// Select Save Option
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(5000);
});

test('App Screen Builder - Moving Tabs', async ({ page }) => {
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
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).fill('App Screen Builder - Moving Tabs');

// Save Newly created section
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(5000);

// Hover over the section that contains the hidden button group
const sectionContainer = page.locator('.group\\/section'); // or use an exact parent container if possible
await sectionContainer.nth(1).hover(); // Adjust the index as needed

// Click the revealed "+ Tabs" button after hover
await page.getByRole('button', { name: 'Tabs' }).nth(1).click();

// Hover over the Right Arrow Key
await page.locator('.transition > .flex > button:nth-child(2)').first().click();

// Validate Tab One has moved when the arrows are selected
await expect(page.getByText('Tab One').first()).toBeVisible();

// Add a new tab & move it to the far left hand side 
await page.locator('.z-30 > .flex').first().click();
await page.locator('div:nth-child(3) > .relative > div > .flex > button').first().click();
await page.locator('div').filter({ hasText: /^Tab Three$/ }).first().click();
await page.locator('div:nth-child(2) > .relative > div > .flex > button').first().click();

await page.waitForTimeout(5000);

//Script Cleanup
await page.locator('[id="__nuxt"] span').filter({ hasText: /^Automation Content$/ }).click();
await page.locator('section').filter({ hasText: 'LayoutContentStyleSection' }).getByRole('button').nth(3).click();


// Save Newly created section
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(5000);
});

test('App Screen Builder - Deleting Tabs', async ({ page }) => {
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
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).fill('App Screen Builder - Deleting Tabs');

// Save Newly created section
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(5000);

// Hover over the section that contains the hidden button group
const sectionContainer = page.locator('.group\\/section'); // or use an exact parent container if possible
await sectionContainer.nth(1).hover(); // Adjust the index as needed

// Click the revealed "+ Tabs" button after hover
await page.getByRole('button', { name: 'Tabs' }).nth(1).click();

// Select the delete option on the tabbed section 
await page.locator('.transition > .flex > button:nth-child(4)').first().click();

// Validate the tabs should not be visible 
await expect(page.getByText('TabTab OneTabTab Two')).not.toBeVisible();

// Save Newly created section
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(5000);

await page.locator('[id="__nuxt"] span').filter({ hasText: /^Automation Content$/ }).click();
await page.locator('section').filter({ hasText: 'LayoutContentStyleSection' }).getByRole('button').nth(3).click();
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(5000);


});

test('App Screen Builder - Tab Title', async ({ page }) => {
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
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).fill('App Screen Builder - Tab Title');

// Save Newly created section
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(5000);

// Hover over the section that contains the hidden button group
const sectionContainer = page.locator('.group\\/section'); // or use an exact parent container if possible
await sectionContainer.nth(1).hover(); // Adjust the index as needed

// Click the revealed "+ Tabs" button after hover
await page.getByRole('button', { name: 'Tabs' }).nth(1).click();

// Select First Tab & Rename to Automation Tab 1
await page.getByRole('textbox', { name: 'Enter tab title...' }).click();
await page.getByRole('textbox', { name: 'Enter tab title...' }).fill('Automation Tab 1');

// Rename Validation 
await expect(page.getByRole('list')).toContainText('Automation Tab 1');

// Rename Tab 2 vai the side menu
await page.locator('[id="__nuxt"]').getByText('App Screen Builder - Tab Title').click();
await page.locator('section').filter({ hasText: 'LayoutContentStylecomponentTabcomponentTabThemeThemeLight Dark Background' }).getByRole('button').nth(1).click();
await page.getByRole('textbox', { name: 'Enter tab title...' }).dblclick();
await page.getByRole('textbox', { name: 'Enter tab title...' }).fill('Automation Tab 2');
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(5000);

// Clean Up Script
await page.locator('[id="__nuxt"] span').filter({ hasText: /^Automation Content$/ }).click();
await page.locator('section').filter({ hasText: 'LayoutContentStyleSection' }).getByRole('button').nth(3).click();

// Save Newly created section
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(5000);
});

test('App Screen Builder - Add Carousel Option', async ({ page }) => {
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
  
  // Add New Section
await page.getByText('Add Section').nth(1).click();

  // Add Section Title
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).click();
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).fill('Add Content (Carousel)');

  // Save Newly created section
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(5000);

// Hover over the section that contains the hidden button group
const sectionContainer = page.locator('.group\\/section'); // or use an exact parent container if possible
await sectionContainer.nth(1).hover(); // Adjust the index as needed

// Click the revealed "+ Tabs" button after hover
await page.getByRole('button', { name: 'Tabs' }).nth(1).click();

// Hover & select Add Carousel
await page.locator('div:nth-child(3) > div > .group\\/hover-zone > div > .relative > div > .gc-button').first().click();

// CMS Content opens & clicks News
await page.locator('.w-\\[194px\\] > div:nth-child(4)').click();

// Select Add to Canvas button
await page.getByRole('button', { name: 'Add to Canvas' }).click();

await page.waitForTimeout(5000);

// Save Newly created section
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(5000);
});

test('App Screen Builder - Tab Add Single Item Option', async ({ page }) => {
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

// Click Tab 2 
await page.locator('div').filter({ hasText: /^Tab Two$/ }).first().click();

// Hover over the carousel & select Single Item option 
await page.locator('div:nth-child(3) > div > .group\\/hover-zone > div > .relative > div:nth-child(2) > .gc-button').click();

// Click the News Section
await page.locator('.w-\\[194px\\] > div:nth-child(4)').click();
await page.waitForTimeout(5000);

// Click Add to canvas
await page.getByRole('button', { name: 'Add to Canvas' }).click();

// Save content
await page.waitForTimeout(5000);
await page.getByRole('button', { name: 'Save' }).click()
});

test('App Screen Builder - Tab Add List Option', async ({ page }) => {
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

// Click Plus icon to add a new tab
await page.locator('.z-30 > .flex').click();

// Select Tab Three
await page.locator('div').filter({ hasText: /^Tab Three$/ }).first().click();

// Hover over content and select List Item 
await page.locator('div:nth-child(3) > div > .group\\/hover-zone > div > .relative > div:nth-child(3) > .gc-button').click();

// Select Video Option 
await page.getByRole('listitem').filter({ hasText: 'Videos' }).click();
await page.waitForTimeout(5000);

// Select Add to canvas 
await page.getByRole('button', { name: 'Add to Canvas' }).click();

// Click the Save Button
await page.getByRole('button', { name: 'Save' }).click()
await page.waitForTimeout(5000);
});

test('App Screen Builder - Tab Add Content Option', async ({ page }) => {
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
await page.waitForTimeout(5000);

// Click Plus icon to add a new tab
await page.locator('.z-30 > .flex > .gc-base-icon > svg').click();

//Click tab four
await page.locator('div').filter({ hasText: /^Tab Four$/ }).first().click();

// Hover & select the content item option 
await page.locator('div:nth-child(3) > div > .group\\/hover-zone > div > .relative > div:nth-child(4) > .gc-button').click();

// Select Content Population
await page.locator('.w-\\[194px\\] > div:nth-child(4)').click();
await page.waitForTimeout(5000);

// Select Add to canvas
await page.getByRole('button', { name: 'Add to Canvas' }).click();

// Save content
await page.getByRole('button', { name: 'Save' }).click()
await page.waitForTimeout(5000);


// Save content
await page.getByRole('button', { name: 'Save' }).click()
await page.waitForTimeout(5000);
});

test('App Screen Builder - Tab Validation', async ({ page }) => {
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
await page.waitForTimeout(5000);

// Validate Tabs one to four
await expect(page.getByRole('textbox', { name: 'Add Section Title' }).nth(1)).toBeVisible();
await expect(page.getByRole('list')).toContainText('Tab One');
await expect(page.getByRole('list')).toContainText('Tab Two');
await expect(page.getByRole('list')).toContainText('Tab Three');
await expect(page.getByRole('list')).toContainText('Tab Four');

// Clean Up Script 
await page.locator('section').filter({ hasText: 'LayoutContentStyleSection' }).getByRole('button').nth(3).click();
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(5000);
});