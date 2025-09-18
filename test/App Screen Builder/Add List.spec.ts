//npx playwright test "test/App Screen Builder/Add List.spec" --headed 
import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

test('App Screen Builder - Add List - News', async ({ page }) => {
  // Navigate to the login page..
await page.goto('https://cms.gc.uzgc2.com/');
await page.getByRole('textbox', { name: 'Email * Email *' }).fill("admin@urbanzoo.io");
await page.getByRole('textbox', { name: 'Password * Password *' }).fill('hsP25v9\\quT{');
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('link', { name: 'Pages' }).click();
await expect(page.locator('#app-screens')).toBeVisible();
await page.locator('#app-screens').click();
await page.locator('[id="__nuxt"]').getByText('Automation - Add List').click();
await page.getByRole('button', { name: 'Edit' }).click();

// Add New Section & title
await page.locator('.p-2 > div:nth-child(2) > div > div:nth-child(2) > div > .flex').click();
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).click();
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).fill('Add List');

// Hover and select Add List option 
await page.locator('div:nth-child(3) > div > div > div > div > div:nth-child(2) > .pt-0 > div:nth-child(2) > div > .group\\/hover-zone > div > .relative > div:nth-child(3) > .gc-button').click();

// Select News button & Validate news is visible 
await expect(page.locator('.w-\\[194px\\] > div:nth-child(4)')).toBeVisible();
await expect(page.locator('h2').filter({ hasText: 'News' })).toBeVisible();
await expect(page.getByRole('dialog')).toContainText('News');
await page.waitForTimeout(5000);

// Click News section 
await page.locator('.w-\\[194px\\] > div:nth-child(4)').click();
await page.waitForTimeout(5000);

// Validate the options dropdown is set to latest
await expect(page.locator('.flex > div:nth-child(2) > div:nth-child(2) > div > div > .p-4')).toBeVisible();

// Click Dropdown menu 
await expect(page.getByRole('dialog')).toContainText('Latest');
await page.locator('.min-h-40 > div > div > .min-w-0 > div > div > .relative > div:nth-child(2)').first().click();

// Validate the Dropdown options
await expect(page.getByRole('listitem').filter({ hasText: 'By Category' }).locator('span')).toBeVisible();
await expect(page.getByRole('listitem').filter({ hasText: 'Latest' }).locator('div')).toBeVisible();

// Select Latest option from the dropdown
await page.getByRole('listitem').filter({ hasText: 'Latest' }).locator('div').click();

// Set & validate Listing Offset
await expect(page.getByText('Listing Offset').first()).toBeVisible();
await expect(page.getByRole('dialog')).toContainText('Listing Offset');
await expect(page.getByPlaceholder('Enter text').first()).toHaveValue('0');

// Set & Validate Number of Cards 
await expect(page.getByText('Number of Cards').first()).toBeVisible();
await expect(page.getByRole('dialog')).toContainText('Number of Cards');
await expect(page.getByPlaceholder('Enter text').nth(1)).toHaveValue('5');

// Select Add to canvas
await page.getByRole('button', { name: 'Add to Canvas' }).click();
await page.waitForTimeout(5000);
await expect(page.locator('.z-\\[1\\]').first()).toBeVisible();

// Save Content
await page.getByRole('button', { name: 'Save' }).click();
await expect(page.getByText('Are you sure?Please wait up')).toBeVisible();
await expect(page.getByRole('paragraph')).toContainText('Please wait up to 30 minutes for your changes to be reflected');
await expect(page.locator('body')).toContainText('Are you sure?');
await expect(page.locator('body')).toContainText('Cancel');
await expect(page.locator('body')).toContainText('Save');
await page.locator('button').filter({ hasText: /^Save$/ }).click();
await page.waitForTimeout(5000);
});


test('App Screen Builder - Add List - Video', async ({ page }) => {
  // Navigate to the login page..
await page.goto('https://cms.gc.uzgc2.com/');
await page.getByRole('textbox', { name: 'Email * Email *' }).fill("admin@urbanzoo.io");
await page.getByRole('textbox', { name: 'Password * Password *' }).fill('hsP25v9\\quT{');
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('link', { name: 'Pages' }).click();
await expect(page.locator('#app-screens')).toBeVisible();
await page.locator('#app-screens').click();
await page.locator('[id="__nuxt"]').getByText('Automation - Add List').click();
await page.getByRole('button', { name: 'Edit' }).click();

// Add New Section & title
await page.locator('.p-2 > div:nth-child(2) > div > div:nth-child(2) > div > .flex').click();
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).click();
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).fill('Add List');

// Hover and select Add List option 
await page.locator('div:nth-child(3) > div > div > div > div > div:nth-child(2) > .pt-0 > div:nth-child(2) > div > .group\\/hover-zone > div > .relative > div:nth-child(3) > .gc-button').click();

// Click Video Option 
await page.getByRole('listitem').filter({ hasText: 'Videos' }).click();
await page.waitForTimeout(5000);

// Validate Video options (Query Type)
await expect(page.getByText('Query Type').first()).toBeVisible();
await expect(page.getByText('The query type determines how').first()).toBeVisible();
await expect(page.locator('.min-h-40 > div > div > .min-w-0 > div > div > .relative').first()).toBeVisible();
await expect(page.getByRole('dialog')).toContainText('Query Type');
await expect(page.getByRole('dialog')).toContainText('The query type determines how the content is listed.');
await expect(page.getByRole('dialog')).toContainText('Latest');

// Validate Video options (Listing Offset)
await expect(page.getByText('Listing Offset').first()).toBeVisible();
await expect(page.getByRole('dialog')).toContainText('Listing Offset');
await expect(page.getByRole('dialog')).toContainText('Listing OffsetOffsets where to start listing by a certain amount.');
await expect(page.getByPlaceholder('Enter text').first()).toBeVisible();
await expect(page.getByPlaceholder('Enter text').first()).toHaveValue('0');

// Validate Video options (Number of Cards)
await expect(page.getByText('Listing Offset').first()).toBeVisible();
await expect(page.getByRole('dialog')).toContainText('Listing Offset');
await expect(page.getByRole('dialog')).toContainText('Listing OffsetOffsets where to start listing by a certain amount.');
await expect(page.getByPlaceholder('Enter text').first()).toBeVisible();
await expect(page.getByPlaceholder('Enter text').first()).toHaveValue('0');
await expect(page.getByText('Number of Cards').first()).toBeVisible();
await expect(page.getByText('(Max 17)').first()).toBeVisible();
await expect(page.getByPlaceholder('Enter text').nth(1)).toBeVisible();
await expect(page.getByRole('dialog')).toContainText('Number of Cards');
await expect(page.getByRole('dialog')).toContainText('(Max 17)');
await expect(page.getByPlaceholder('Enter text').nth(1)).toHaveValue('5');

// Select Add to Canvas 
await page.getByRole('button', { name: 'Add to Canvas' }).click();
await page.waitForTimeout(5000);

// Validate Video list is visible 
await expect(page.locator('.z-\\[1\\]').first()).toBeVisible();

// Save Content
await page.getByRole('button', { name: 'Save' }).click();
await expect(page.getByText('Are you sure?Please wait up')).toBeVisible();
await expect(page.getByRole('paragraph')).toContainText('Please wait up to 30 minutes for your changes to be reflected');
await expect(page.locator('body')).toContainText('Are you sure?');
await expect(page.locator('body')).toContainText('Cancel');
await expect(page.locator('body')).toContainText('Save');
await page.locator('button').filter({ hasText: /^Save$/ }).click();
await page.waitForTimeout(5000);
});

test('App Screen Builder - Add List - Clean Up Script', async ({ page }) => {
  // Navigate to the login page..
await page.goto('https://cms.gc.uzgc2.com/');
await page.getByRole('textbox', { name: 'Email * Email *' }).fill("admin@urbanzoo.io");
await page.getByRole('textbox', { name: 'Password * Password *' }).fill('hsP25v9\\quT{');
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('link', { name: 'Pages' }).click();
await expect(page.locator('#app-screens')).toBeVisible();
await page.locator('#app-screens').click();
await page.locator('[id="__nuxt"]').getByText('Automation - Add List').click();
await page.getByRole('button', { name: 'Edit' }).click();

// Select Delete option on the side menu panel
await page.locator('div:nth-child(2) > .group > div > .gc-layout-item__actions > button:nth-child(2)').click();

// Select Delete option on the side menu panel
await page.locator('section').filter({ hasText: 'LayoutContentStyleSection' }).getByRole('button').nth(3).click();

// Click Save 
await page.getByRole('button', { name: 'Save' }).click();
await expect(page.getByText('Are you sure?Please wait up')).toBeVisible();
await expect(page.getByRole('paragraph')).toContainText('Please wait up to 30 minutes for your changes to be reflected');
await expect(page.locator('body')).toContainText('Are you sure?');
await expect(page.locator('body')).toContainText('Cancel');
await expect(page.locator('body')).toContainText('Save');
await page.locator('button').filter({ hasText: /^Save$/ }).click();
await page.waitForTimeout(5000);

});