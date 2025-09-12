//npx playwright test "test/App Screen Builder/Carousel.spec" --headed 
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


test('App Screen Builder - Carousel - News', async ({ page }) => {
  // Navigate to the login page..
await page.goto('https://cms.gc.uzgc2.com/');
await page.getByRole('textbox', { name: 'Email * Email *' }).fill(email);
await page.getByRole('textbox', { name: 'Password * Password *' }).fill(password);
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('link', { name: 'Pages' }).click();
await expect(page.locator('#app-screens')).toBeVisible();
await page.locator('#app-screens').click();
await page.locator('[id="__nuxt"]').getByText('Automation - Carousel').click();
await page.getByRole('button', { name: 'Edit' }).click();

// Add new section & add title
await page.locator('.p-2 > div:nth-child(2) > div > div:nth-child(2) > div > .flex').click();
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).dblclick();
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).fill('Carousel - News');
await expect(page.locator('div:nth-child(3) > div > div > div').first()).toBeVisible();
await expect(page.getByRole('textbox', { name: 'Add Section Title' }).nth(1)).toHaveValue('Carousel - News');

// Hover & Select Carousel Content
await page.locator('div:nth-child(3) > div > div > div > div > div:nth-child(2) > .pt-0 > div:nth-child(2) > div > .group\\/hover-zone > div > .relative > div > .gc-button').first().click();
await expect(page.getByRole('listitem').filter({ hasText: 'News' })).toBeVisible();
await expect(page.getByRole('dialog').locator('h2')).toBeVisible();
await expect(page.locator('.w-\\[194px\\] > div:nth-child(4)')).toBeVisible();

// Select News Content & Validate 
await page.locator('.w-\\[194px\\] > div:nth-child(4)').click();
//await expect(page.locator('.relative > div > div:nth-child(2) > div:nth-child(2) > div > div')).toBeVisible();
await page.waitForTimeout(5000);

// News Validation 
await expect(page.getByRole('heading', { name: 'News', exact: true })).toBeVisible();
await expect(page.getByText('Query Type').first()).toBeVisible();
await expect(page.getByRole('dialog')).toContainText('Query Type');
await expect(page.getByText('Listing Offset').first()).toBeVisible();
await expect(page.getByRole('dialog')).toContainText('Listing Offset');
await expect(page.getByText('Listing Offset').first()).toBeVisible();
await expect(page.getByText('Number of Cards').first()).toBeVisible();
await expect(page.getByRole('dialog')).toContainText('Listing Offset');
await expect(page.getByRole('dialog')).toContainText('Number of Cards');

// Select Add to Canvas
await page.getByRole('button', { name: 'Add to Canvas' }).click();

// Save Content
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(2000);
await expect(page.getByText('Are you sure?Please wait up')).toBeVisible();
await expect(page.getByRole('paragraph')).toContainText('Please wait up to 30 minutes for your changes to be reflected');
await expect(page.locator('body')).toContainText('Are you sure?');
await expect(page.locator('body')).toContainText('Cancel');
await expect(page.locator('body')).toContainText('Save');
await page.locator('button').filter({ hasText: /^Save$/ }).click();
await page.waitForTimeout(2000);

// Clean Up Script
await page.locator('[id="__nuxt"] span').filter({ hasText: /^Automation - Carousel$/ }).click();
await page.locator('section').filter({ hasText: 'LayoutContentStyleSection' }).getByRole('button').nth(3).click();
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(1000);
await expect(page.getByText('Are you sure?Please wait up')).toBeVisible();
await page.locator('button').filter({ hasText: /^Save$/ }).click();
await page.waitForTimeout(2000);
});


test('App Screen Builder - Carousel - Video Carousel', async ({ page }) => {
    // Navigate to the login page..
await page.goto('https://cms.gc.uzgc2.com/');
await page.getByRole('textbox', { name: 'Email * Email *' }).fill(email);
await page.getByRole('textbox', { name: 'Password * Password *' }).fill(password);
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('link', { name: 'Pages' }).click();
await expect(page.locator('#app-screens')).toBeVisible();
await page.locator('#app-screens').click();
await page.locator('[id="__nuxt"]').getByText('Automation - Carousel').click();
await page.getByRole('button', { name: 'Edit' }).click();
  
  // Add new section & add title
await page.locator('.p-2 > div:nth-child(2) > div > div:nth-child(2) > div > .flex').click();
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).click();
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).fill(' Carousel - Video Carousel');

// Add Video content & validation 
await page.locator('div:nth-child(3) > div > div > div > div > div:nth-child(2) > .pt-0 > div:nth-child(2) > div > .group\\/hover-zone > div > .relative > div > .gc-button').first().click();
await page.getByRole('listitem').filter({ hasText: 'Videos' }).click();
await page.waitForTimeout(5000);
await expect(page.getByRole('listitem').filter({ hasText: 'Videos' })).toBeVisible();
await expect(page.getByRole('heading', { name: 'Videos' })).toBeVisible();
await expect(page.locator('.flex > div:nth-child(2) > div:nth-child(2) > div > div > .p-4')).toBeVisible();

// Click Add to canvas
await page.getByRole('button', { name: 'Add to Canvas' }).click();
await page.waitForTimeout(5000);

// Video Validation
await expect(page.locator('.z-\\[1\\]')).toBeVisible();
await expect(page.getByRole('list')).toContainText('Video Carousel');

// Save Content
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(2000);
await page.locator('button').filter({ hasText: /^Save$/ }).click();
await page.waitForTimeout(5000);

// Clean Up Script
await page.locator('[id="__nuxt"] span').filter({ hasText: /^Automation - Carousel$/ }).click();
await page.locator('section').filter({ hasText: 'LayoutContentStyleSection' }).getByRole('button').nth(3).click();
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(2000);
await page.locator('button').filter({ hasText: /^Save$/ }).click();
await page.waitForTimeout(5000);
});

test('App Screen Builder - Carousel - Fixture Carousel (Upcoming)', async ({ page }) => {
    // Navigate to the login page..
await page.goto('https://cms.gc.uzgc2.com/');
await page.getByRole('textbox', { name: 'Email * Email *' }).fill(email);
await page.getByRole('textbox', { name: 'Password * Password *' }).fill(password);
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('link', { name: 'Pages' }).click();
await expect(page.locator('#app-screens')).toBeVisible();
await page.locator('#app-screens').click();
await page.locator('[id="__nuxt"]').getByText('Automation - Carousel').click();
await page.getByRole('button', { name: 'Edit' }).click();

// Add new section and add a title
await page.locator('.p-2 > div:nth-child(2) > div > div:nth-child(2) > div > .flex').click();
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).click();
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).fill('Carousel - Fixture Carousel (Upcoming)');
await expect(page.getByRole('textbox', { name: 'Add Section Title' }).nth(1)).toHaveValue('Carousel - Fixture Carousel (Upcoming)');

// Hover & add carousel from the menu 
await page.locator('div:nth-child(3) > div > div > div > div > div:nth-child(2) > .pt-0 > div:nth-child(2) > div > .group\\/hover-zone > div > .relative > div > .gc-button').first().click();
await page.getByRole('listitem').filter({ hasText: 'Fixture' }).click();
await page.locator('div').filter({ hasText: /^Upcoming$/ }).locator('div').nth(3).click();
await page.waitForTimeout(5000);

// Add Validation 
await expect(page.getByRole('heading', { name: 'Fixture', exact: true })).toBeVisible();
await expect(page.locator('.flex > div:nth-child(2) > div:nth-child(2) > div > div > .p-4')).toBeVisible();
await expect(page.getByRole('dialog')).toContainText('Fixture');
await expect(page.getByRole('listitem').filter({ hasText: 'Fixture' })).toBeVisible();

// Add to Canvas
await page.getByRole('button', { name: 'Add to Canvas' }).click();
await page.waitForTimeout(5000);
await expect(page.locator('.z-\\[1\\]')).toBeVisible();
await expect(page.getByRole('list')).toContainText('Fixture Carousel: Upcoming');

// Save Content
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(2000);
await page.locator('button').filter({ hasText: /^Save$/ }).click();
await page.waitForTimeout(5000);

// Clean Up Script
await page.locator('[id="__nuxt"] span').filter({ hasText: /^Automation - Carousel$/ }).click();
await page.locator('section').filter({ hasText: 'LayoutContentStyleSection' }).getByRole('button').nth(3).click();
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(1000);
await page.locator('button').filter({ hasText: /^Save$/ }).click();
await page.waitForTimeout(3000);
});


test('App Screen Builder - Carousel - Fixture Carousel (Result)', async ({ page }) => {
    // Navigate to the login page..
await page.goto('https://cms.gc.uzgc2.com/');
await page.getByRole('textbox', { name: 'Email * Email *' }).fill(email);
await page.getByRole('textbox', { name: 'Password * Password *' }).fill(password);
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('link', { name: 'Pages' }).click();
await expect(page.locator('#app-screens')).toBeVisible();
await page.locator('#app-screens').click();
await page.locator('[id="__nuxt"]').getByText('Automation - Carousel').click();
await page.getByRole('button', { name: 'Edit' }).click();

// Add a new section & add the title Fixture Carousel (Result)
await page.locator('.p-2 > div:nth-child(2) > div > div:nth-child(2) > div > .flex').click();
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).click();
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).fill('Fixture Carousel (Result)');

// Hover & select Carousel option 
await page.locator('div:nth-child(3) > div > div > div > div > div:nth-child(2) > .pt-0 > div:nth-child(2) > div > .group\\/hover-zone > div > .relative > div > .gc-button').first().click();

// Select Fixture option
await page.getByRole('listitem').filter({ hasText: 'Fixture' }).click();
await expect(page.getByRole('listitem').filter({ hasText: 'Fixture' })).toBeVisible();
await expect(page.getByRole('heading', { name: 'Fixture', exact: true })).toBeVisible();

// Select Results option from the panel
await page.locator('div').filter({ hasText: /^Result$/ }).locator('div').nth(3).click();
await page.waitForTimeout(5000);

// Results Validation 
await expect(page.getByRole('listitem').filter({ hasText: 'Fixture' })).toBeVisible();
await expect(page.getByRole('heading', { name: 'Fixture', exact: true })).toBeVisible();
await expect(page.locator('.flex > div:nth-child(2) > div:nth-child(2) > div > div > .p-4')).toBeVisible();
await expect(page.getByRole('dialog')).toContainText('Fixture');
await expect(page.getByRole('dialog')).toContainText('Fixture');

// Click Add to Canvas
await page.getByRole('button', { name: 'Add to Canvas' }).click();
await page.waitForTimeout(5000);

// Fixture Validation 
await expect(page.locator('.z-\\[1\\]')).toBeVisible();
await expect(page.getByRole('list')).toContainText('Fixture Carousel: Results');

// Save Content
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(2000);
await page.locator('button').filter({ hasText: /^Save$/ }).click();

// Clean Up Script
await page.locator('[id="__nuxt"] span').filter({ hasText: /^Automation - Carousel$/ }).click();
await page.locator('section').filter({ hasText: 'LayoutContentStyleSection' }).getByRole('button').nth(3).click();
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(2000);
await page.locator('button').filter({ hasText: /^Save$/ }).click();
await page.waitForTimeout(5000);
});
