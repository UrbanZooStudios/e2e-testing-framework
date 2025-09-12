//npx playwright test "test/PageBuilder/Quote Widget.spec.ts" --headed
import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

// Fetch environment variables for authentication
const email = process.env.PLAYWRIGHT_EMAIL;
const password = process.env.PLAYWRIGHT_PASSWORD;
const testEmail = process.env.PLAYWRIGHT_TEST_EMAIL;
const testPassword = process.env.PLAYWRIGHT_TEST_PASSWORD;
const previewUsername = process.env.PREVIEW_USERNAME || 'urbanzoo';
const previewPassword = process.env.PREVIEW_PASSWORD || 'gamechanger1!';

// Validate that the required environment variables are set
if (!email || !password) {
  throw new Error("Main login Email or Password is not set in environment variables.");
}
if (!testEmail || !testPassword) {
  throw new Error("Test Email or Test Password is not set in environment variables.");
}

test('CMS - Content - Quote Widget', async ({ page }) => {
  // Navigate to the login page..
await page.goto('https://cms.gc.uzstaging1.co.uk/');
await page.getByRole('textbox', { name: 'Email * Email *' }).fill(email);
await page.getByRole('textbox', { name: 'Password * Password *' }).fill(password);
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('link', { name: 'Pages' }).click();
await page.getByRole('link', { name: 'Edit pages' }).click();
await page.locator('a').filter({ hasText: 'Automation +' }).click();
await page.locator('a').filter({ hasText: 'Quote Widget +' }).click();
await page.waitForTimeout(5000);
await page.locator('a').filter({ hasText: /^Content$/ }).click();
await page.waitForTimeout(5000);
await page.getByRole('button', { name: 'Edit' }).click();
await page.waitForTimeout(5000);

// Add new section 
await page.getByRole('button', { name: 'New Section' }).click();

// Hover & Select Section Button
await page.locator('#section').getByRole('button').nth(2).click();

// Select Quote option from the side menu 
await page.getByRole('listitem').filter({ hasText: 'Quote' }).click();

// Select Quote the plane
await page.locator('.absolute.top-0.left-0.w-full.h-full.transition-all.duration-200.border').click();

// Select Add to canvas
await page.getByRole('button', { name: 'Add to Canvas' }).click();

// From the right hand side menu click Text Contetn 
await page.locator('div:nth-child(2) > div > div > div:nth-child(2) > #gc-accordion-header-accordion-0').click();
await page.waitForTimeout(5000);

// Click text box
await page.getByRole('paragraph').filter({ hasText: /^$/ }).nth(1).click();

// Fill the first part
await page.getByRole('textbox').first().fill(
    'The Council recognises how valuable AFC Bournemouth is to Bournemouth, Christchurch and Poole, with its continued success on the pitch, and their support for our local communities.'
  );
  
  // Press Enter for a new paragraph / gap
await page.keyboard.press('Enter');
  
  // Type the second part (so it appends, not replaces)
await page.keyboard.type(
    'We have a positive relationship with the football club and have enjoyed like many, their recent successes on the pitch. We look forward to working with them on their plans to invest in the area and improve the matchday experience for fans at Vitality Stadium, via the appropriate planning and democratic processes.'
  );
  
await page.getByRole('button', { name: 'Save' }).click();

// Validation Point 1 - As a user I hover choose to select this widget option from the modal & it will appear on the canvas
await expect(page.locator('.gc-quote-widget').first()).toBeVisible();

// Validation Point 2 - As a user I am able to view the media selection
await expect(page.getByRole('region', { name: 'Media Selection' }).first()).toBeVisible();
await expect(page.locator('[id="__nuxt"]')).toContainText('Media Selection');

});

test('Fanside - Content - Quote Widget Validation',async ({ browser }, testInfo) => {
const context = await browser.newContext({ httpCredentials: {
        username: previewUsername,
        password: previewPassword,},
    });
  
const page = await context.newPage();

    // Navigate to the live preview page
await page.goto('https://beta.gc.uzstaging1.co.uk/preview/77515f53-54da-42a9-8b2f-052dca0c3ec3', {
waitUntil: 'domcontentloaded',});
  
    // Text we expect
const part1 ='The Council recognises how valuable AFC Bournemouth is to Bournemouth, Christchurch and Poole, with its continued success on the pitch, and their support for our local communities.';
const part2 ='We have a positive relationship with the football club and have enjoyed like many, their recent successes on the pitch. We look forward to working with them on their plans to invest in the area and improve the matchday experience for fans at Vitality Stadium, via the appropriate planning and democratic processes.';
  
// Basic visibility & content checks in the main region
await expect(page.getByRole('main')).toContainText(part1);
await expect(page.getByRole('main')).toContainText(part2);
await expect(page.getByText('We have a positive').first()).toBeVisible();

});

test('CMS - Spilt Container - 1 Container', async ({ page }) => {
    // Navigate to the login page..
await page.goto('https://cms.gc.uzstaging1.co.uk/');
await page.getByRole('textbox', { name: 'Email * Email *' }).fill(email);
await page.getByRole('textbox', { name: 'Password * Password *' }).fill(password);
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('link', { name: 'Pages' }).click();
await page.getByRole('link', { name: 'Edit pages' }).click();
await page.locator('a').filter({ hasText: 'Automation +' }).click();
await page.locator('a').filter({ hasText: 'Quote Widget +' }).click();
await page.locator('a').filter({ hasText: 'Spilt Container +' }).click();
await page.locator('a').filter({ hasText: '1 Container' }).click();
await page.waitForTimeout(5000);
await page.getByRole('button', { name: 'Edit' }).click();
await page.waitForTimeout(5000);

// Add new section 
await page.getByRole('button', { name: 'New Section' }).click();
await page.locator('#section').getByRole('button').nth(3).click();

//Validate Spilt container is visible & text Split Container
await expect(page.getByText('Split Container').first()).toBeVisible();
await expect(page.getByRole('dialog')).toContainText('Split Container');
await expect(page.getByRole('dialog').locator('div').filter({ hasText: /^1 Container$/ }).locator('div').nth(3)).toBeVisible();
await page.getByRole('dialog').locator('div').filter({ hasText: /^1 Container$/ }).locator('div').nth(3).click();

// Select Add to canvas
await page.getByRole('button', { name: 'Add Row to Page' }).click();

// Click inside the content box from the canvas
await page.locator('#section').getByRole('button', { name: 'Content' }).click();

// Select the quote option 
await page.getByRole('listitem').filter({ hasText: 'Quote' }).click();

// Validate the quote text & icon is visible
await expect(page.getByRole('listitem').filter({ hasText: 'Quote' })).toBeVisible();
await expect(page.locator('.absolute.top-0.left-0.w-full.h-full.transition-all.duration-200.border')).toBeVisible();

// Select Add to canvas
await page.getByRole('button', { name: 'Add to Canvas' }).click();

// Add Media file to the container
await page.getByRole('button', { name: 'Select file' }).click();
await page.waitForTimeout(3000);

// Select the search & type Sponsor 
await page.getByRole('textbox', { name: 'Search' }).fill('Sponsor');
await page.waitForTimeout(3000);
await page.locator('img').nth(3).click();
await page.locator('img').nth(3).click();

// Select Add to Canvas
await page.getByRole('button', { name: 'Add To Canvas' }).click();

// Validate Quote image is visible 
await expect(page.getByRole('img', { name: 'Quote Image' }).first()).toBeVisible();

// Select the save option
await page.getByRole('button', { name: 'Save' }).click();
});

test('Fanside - Spilt Container - 1 Container',async ({ browser }, testInfo) => {
    const context = await browser.newContext({ httpCredentials: {
            username: previewUsername,
            password: previewPassword,},
        });
      
    const page = await context.newPage();
    
        // Navigate to the live preview page
    await page.goto('https://beta.gc.uzstaging1.co.uk/preview/77515f53-54da-42a9-8b2f-052dca0c3ec3', {
    waitUntil: 'domcontentloaded',});
});