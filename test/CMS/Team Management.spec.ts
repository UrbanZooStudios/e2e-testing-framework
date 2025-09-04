//npx playwright test "test/CMS/Team Management.spec.ts" --headed

import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

// Fetch environment variables for authentication
const email = process.env.UZGC2_EMAIL;
const password = process.env.UZGC2_PASSWORD;
const testEmail = process.env.UZGC2_TEST_EMAIL;
const testPassword = process.env.UZGC2_TEST_PASSWORD;
const STAGING_1_EMAIL = process.env.STAGING_1_EMAIL
const STAGING_1_PASSWORD = process.env.STAGING_1_PASSWORD
const previewUsername = process.env.PREVIEW_USERNAME || 'urbanzoo';
const previewPassword = process.env.PREVIEW_PASSWORD || 'gamechanger1!';


// Validate that the required environment variables are set
if (!STAGING_1_EMAIL || !STAGING_1_PASSWORD) {
  throw new Error("Main login Email or Password is not set in environment variables.");
}
if (!testEmail || !testPassword) {
  throw new Error("Test Email or Test Password is not set in environment variables.");
}

test('Player Sponsors > Team Management > Current Squad ', async ({ page }) => {
    
// Navigate to the login page
//await page.goto('https://cms.gc.uzgc2.com/login');
await page.goto('https://cms.gc.uzstaging1.co.uk/login');
await page.getByRole('textbox', { name: 'Email * Email *' }).fill(STAGING_1_EMAIL);
await page.getByRole('textbox', { name: 'Password * Password *' }).fill(STAGING_1_PASSWORD);
await page.getByRole('button', { name: 'Sign in' }).click();

// Access CMS > Team Management
await page.getByRole('link', { name: 'Team Management' }).click();
await page.waitForTimeout(1000);

// Select Manage Squads
await expect(page.getByRole('link', { name: 'Manage Squads' })).toBeVisible();
await expect(page.locator('body')).toContainText('Manage Squads');
await page.getByRole('link', { name: 'Manage Squads' }).click();

// Click current squad tab
await expect(page.locator('body')).toContainText('Current Squad');

// Select the player using the actions icon
await page.getByRole('row', { name: 'Opta p111234 jordanpickford' }).getByRole('button').click();

// Select “Player Sponsors,” upload an image, and click “Save.
await page.getByRole('heading', { name: 'Player Sponsors' }).click();

// Select Add New Sponsor button 
await page.getByRole('button', { name: 'Add New Sponsor' }).click();
await page.getByRole('button', { name: 'Open Media library' }).nth(1).click();
await page.getByRole('textbox', { name: 'Search the library' }).click();
await page.getByRole('textbox', { name: 'Search the library' }).fill('sponsor');
await page.getByRole('button', { name: 'Search' }).click();

// Select Open Media Library & search for image > Click image and click add then save
await page.getByRole('article').filter({ hasText: 'Sponsor.png' }).getByRole('button').first().click();
await page.getByText('Cancel Add').click();
await page.getByRole('button', { name: 'Add', exact: true }).click();
await page.getByRole('button', { name: 'Delete this sponsor' }).nth(1).click();

});

test('Player Sponsors > Fanside Validation', async ({ browser }, testInfo) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
  
// Navigate to the Tranmere Rovers live preview site
await page.goto('https://beta.gc.uzstaging1.co.uk/teams/men/jordanpickford');
await expect(page.locator('.mx-2 > a').first()).toBeVisible();
});
  