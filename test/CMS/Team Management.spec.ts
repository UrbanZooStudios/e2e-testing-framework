//npx playwright test "test/CMS/Team Management.spec.ts" --headed

import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

// Fetch environment variables for authentication
const previewUsername = process.env.PREVIEW_USERNAME || 'urbanzoo';
const previewPassword = process.env.PREVIEW_PASSWORD || 'gamechanger1!';

test('Player Sponsors > Team Management > Current Squad ', async ({ page }) => {
    
// Navigate to the login page
//await page.goto('https://cms.gc.uzgc2.com/login');
await page.goto('https://cms.gc.gc2stagingservices.co.uk/');
await page.getByRole('textbox', { name: 'Email * Email *' }).fill("automation@urbanzoo.io");
await page.getByRole('textbox', { name: 'Password * Password *' }).fill('hsP25v9\\\\quT{');
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
await page.getByRole('button', { name: '󰉋' }).nth(1).click();
await page.getByRole('textbox', { name: 'Search the library' }).click();
await page.getByRole('textbox', { name: 'Search the library' }).fill('logo');
await page.getByRole('button', { name: 'Search' }).click();

// Select Open Media Library & search for image > Click image and click add then save
await page.getByRole('article').getByRole('button').first().click();
await page.getByText('Cancel Add').click();
await page.getByRole('button', { name: 'Add', exact: true }).click();
await page.getByRole('button', { name: 'Delete this sponsor' }).nth(1).click();

});

test('Player Profile Sponsors > Fanside Validation', async ({ browser }, testInfo) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
  
// Navigate to the Tranmere Rovers live preview site
await page.goto('https://www.gc2staging.co.uk/teams/men/jordanpickford', { waitUntil: 'networkidle' });

// Wait explicitly for the selector before asserting visibility
const imageLink = page.locator('.mx-2 > a').first();

// Ensure the element is attached to the DOM
await imageLink.waitFor({ state: 'visible', timeout: 10000 });

// Assert it's visible
await expect(imageLink).toBeVisible();
});

test('Team Profile Sponsors > Fanside Validation', async ({ browser }, testInfo) => {
  test.setTimeout(120000); // 2 minutes

  const context = await browser.newContext({
    httpCredentials: {
      username: previewUsername,
      password: previewPassword,
    },
  });

  const page = await context.newPage();

// Navigate to the Tranmere Rovers live preview site
await page.goto('https://www.gc2staging.co.uk/teams/', { waitUntil: 'networkidle' });

// Wait explicitly for the selector before asserting visibility
const imageLink = page.locator('img.object-contain.max-h-full.p-1.min-h-10').first();

// Ensure the element is attached to the DOM
await imageLink.waitFor({ state: 'visible', timeout: 10000 });

// Assert it's visible
await expect(imageLink).toBeVisible();
});
  