//npx playwright test "test/App Screen Builder/Section Navigation.spec.ts" --headed

import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

test.skip('CMS: Navigate to App Screen Builder and validate Automation tab UI', async ({ page }) => {
// Navigate to the login page
await page.goto('https://cms.gc.uzgc2.com/');

await page.getByRole('textbox', { name: 'Email * Email *' }).fill("automation@urbanzoo.io");
await page.getByRole('textbox', { name: 'Password * Password *' }).fill('hsP25v9\\\\quT{');

// Click the "Sign in" button
await page.getByRole('button', { name: 'Sign in' }).click();

//Click App Screen Builder Option on CMS 
await page.getByRole('link', { name: 'Pages' }).click();

// Verify that the #app-screens element is visible on the page
await expect(page.locator('#app-screens')).toBeVisible();

// Click on the #app-screens element
await page.locator('#app-screens').click();

// Verify that the "Manage App" text is visible after the click
await expect(page.getByText('Manage App')).toBeVisible();

// Check that the banner contains the text "Manage App"
await expect(page.getByRole('banner')).toContainText('Manage App');

// Ensure the banner is visible on the page
await expect(page.getByRole('banner')).toBeVisible();

// Verify that the "Manage AppFixed" text is visible (may be a typo or separate element)
await expect(page.getByText('Manage AppFixed')).toBeVisible();
await page.waitForLoadState('networkidle');
// Select the Automation Tab From within App Screen Builder
await page.locator('[id="__nuxt"]').getByText('Automation - Section Navigation', { exact: true }).click();
await page.waitForLoadState('networkidle');
// Verify that a heading with the name "Automation" is visible
await expect(page.getByRole('heading', { name: 'Automation - Section Navigation' })).toBeVisible();
await page.waitForLoadState('networkidle');
// Ensure the first <h1> element contains the text "Automation"
await expect(page.locator('h1')).toContainText('Automation - Section Navigation');

// Check that the element with class ".px-4 > .h-[72px]" is visible (likely a layout or title container)
await expect(page.locator('.px-4 > .h-\\[72px\\]')).toBeVisible();
});

test.skip('App Screen Builder - Section Add Section Button', async ({ page }) => {
// Navigate to the login page
await page.goto('https://cms.gc.uzgc2.com/');
await page.getByRole('textbox', { name: 'Email * Email *' }).fill("automation@urbanzoo.io");
await page.getByRole('textbox', { name: 'Password * Password *' }).fill('hsP25v9\\\\quT{');
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('link', { name: 'Pages' }).click();
await expect(page.locator('#app-screens')).toBeVisible();
await page.locator('#app-screens').click();
await page.locator('[id="__nuxt"]').getByText('Automation - Section Navigation', { exact: true }).click();
await page.getByRole('button', { name: 'Edit' }).click();

// Select the edit button (assumed to be the third item in a list)
await page.getByRole('list').locator('div').nth(2).click();

// Confirm the list contains the text "Section"
await expect(page.getByRole('list')).toContainText('Section');

// Verify the textbox for "Add Section Title" is visible
await expect(page.getByRole('textbox', { name: 'Add Section Title' })).toBeVisible();

// Check if the "Tabs" button is visible
await expect(page.getByRole('button', { name: 'Tabs' })).toBeVisible();

// Ensure the 4th button in the group is visible (possibly a tab-related control)
await expect(page.locator('button:nth-child(4)').first()).toBeVisible();
await expect(page.locator('button:nth-child(4)').first()).toBeVisible(); // (Duplicate – consider removing)

// Check if the 5th button is also visible
await expect(page.locator('button:nth-child(5)')).toBeVisible();

// Verify the hover zone div inside a group is visible
await expect(page.locator('.group\\/hover-zone > div')).toBeVisible();

// Confirm a nested flex container is visible (likely UI content area)
await expect(page.locator('.p-2 > div:nth-child(2) > div > div:nth-child(2) > div > .flex')).toBeVisible();

// Add Section Title
await page.getByRole('textbox', { name: 'Add Section Title' }).first().click();
await page.getByRole('textbox', { name: 'Add Section Title' }).first().fill('Section 1')

// Save Newly created section
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(1000);
await page.locator('button').filter({ hasText: /^Save$/ }).click();
await page.waitForTimeout(2000);
});

test.skip('App Screen Builder - Add Mulitple Sections', async ({ page }) => {
  // Navigate to the login page
await page.goto('https://cms.gc.uzgc2.com/');
await page.getByRole('textbox', { name: 'Email * Email *' }).fill("automation@urbanzoo.io");
await page.getByRole('textbox', { name: 'Password * Password *' }).fill('hsP25v9\\\\quT{');
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('link', { name: 'Pages' }).click();
await expect(page.locator('#app-screens')).toBeVisible();
await page.locator('#app-screens').click();
await page.locator('[id="__nuxt"]').getByText('Automation - Section Navigation', { exact: true }).click();
await page.getByRole('button', { name: 'Edit' }).click();

// Click on a deeply nested flex container (likely part of the UI layout or section control)
await page.locator('.p-2 > div:nth-child(2) > div > div:nth-child(2) > div > .flex').click();

// Check if the second instance of the text "Section" is visible (likely a UI label or heading)
await expect(page.getByText('Section', { exact: true }).nth(1)).toBeVisible();

// Verify that the second "Tabs" button is visible (could represent a tab inside a section editor)
await expect(page.getByRole('button', { name: 'Tabs' }).nth(1)).toBeVisible();

// Confirm a specific nested button (possibly a tab toggle or UI control) is visible
await expect(page.locator('div:nth-child(3) > div > div > div > div > div > div > button:nth-child(2)')).toBeVisible();

// Add Section Title
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).click();
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).fill('Tab Section');

// Save Newly created section
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(1000);
await page.locator('button').filter({ hasText: /^Save$/ }).click();
await page.waitForTimeout(2000);
});
  
test.skip('App Screen Builder - Section Tabs Button', async ({ page }) => {
  // Navigate to the login page
await page.goto('https://cms.gc.uzgc2.com/');
await page.getByRole('textbox', { name: 'Email * Email *' }).fill("automation@urbanzoo.io");
await page.getByRole('textbox', { name: 'Password * Password *' }).fill('hsP25v9\\\\quT{');
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('link', { name: 'Pages' }).click();
await expect(page.locator('#app-screens')).toBeVisible();
await page.locator('#app-screens').click();
await page.locator('[id="__nuxt"]').getByText('Automation - Section Navigation', { exact: true }).click();
await page.getByRole('button', { name: 'Edit' }).click();

// Add New Section
await page.locator('div:nth-child(3) > div > div:nth-child(2) > div > .flex').click();

// Add Section Title
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(2).click();
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(2).fill('Section 3');

// Save Newly created section
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(1000);
await page.locator('button').filter({ hasText: /^Save$/ }).click();
await page.waitForTimeout(1000);

// Hover over the section that contains the hidden button group
const sectionContainer = page.locator('.group\\/section'); // or use an exact parent container if possible
await sectionContainer.nth(2).hover(); // Adjust the index as needed

// Click the revealed "+ Tabs" button after hover
await page.getByRole('button', { name: 'Tabs' }).nth(1).click();

// Verify that "Tab One" is visible in the list
await expect(page.getByRole('list').getByText('Tab One')).toBeVisible();

// Confirm the list contains "Tab One"
await expect(page.getByRole('list')).toContainText('Tab One');

// Confirm the list contains "Tab Two"
await expect(page.getByRole('list')).toContainText('Tab Two');

// Check if the "Tab Two" item is visibly rendered
await expect(page.locator('div').filter({ hasText: /^Tab Two$/ }).first()).toBeVisible();

// Verify that the flex container (likely a UI control or overlay) is visible
await expect(page.locator('.z-30 > .flex')).toBeVisible();

// Click on the flex container (likely to trigger or reveal more UI)
await page.locator('.z-30 > .flex').click();

// Verify that "Tab Three" becomes visible after the interaction
await expect(page.locator('div').filter({ hasText: /^Tab Three$/ }).first()).toBeVisible();

// Save Newly created section
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(2000);
await page.locator('button').filter({ hasText: /^Save$/ }).click();
await page.waitForTimeout(1000);
});

test.skip('App Screen Builder - Section Arrow Buttons', async ({ page }) => {
  // Navigate to the login page
  await page.goto('https://cms.gc.uzgc2.com/');
  await page.getByRole('textbox', { name: 'Email * Email *' }).fill("automation@urbanzoo.io");
  await page.getByRole('textbox', { name: 'Password * Password *' }).fill('hsP25v9\\\\quT{');
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Navigate to App Screen Builder
  await page.getByRole('link', { name: 'Pages' }).click();
  await expect(page.locator('#app-screens')).toBeVisible();
  await page.locator('#app-screens').click();
  await page.locator('[id="__nuxt"]').getByText('Automation - Section Navigation', { exact: true }).click();
  await page.getByRole('button', { name: 'Edit' }).click();

// Hover the first section to trigger the toolbar & select down arrow
const section = page.locator('.group\\/section').first();
await section.hover();
await page.locator('button:nth-child(3)').first().click();

// Hover the first section to trigger the toolbar & select up arrow 
await section.hover();
await page.locator('div:nth-child(3) > div > div > div > div > div > div > button:nth-child(2)').click();
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(1000);
await page.locator('button').filter({ hasText: /^Save$/ }).click();
await page.waitForTimeout(2000);
});

test.skip('App Screen Builder - Section Duplicate Button', async ({ page }) => {
  // Navigate to the login page
  await page.goto('https://cms.gc.uzgc2.com/');
  await page.getByRole('textbox', { name: 'Email * Email *' }).fill("automation@urbanzoo.io");
  await page.getByRole('textbox', { name: 'Password * Password *' }).fill('hsP25v9\\\\quT{');
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Navigate to App Screen Builder
  await page.getByRole('link', { name: 'Pages' }).click();
  await expect(page.locator('#app-screens')).toBeVisible();
  await page.locator('#app-screens').click();
  await page.locator('[id="__nuxt"]').getByText('Automation - Section Navigation', { exact: true }).click();
  await page.getByRole('button', { name: 'Edit' }).click();

// Hover the first section to trigger the toolbar & select down arrow
const section = page.locator('.group\\/section').first();
await section.hover();

// Select Duplicate Button
await page.locator('button:nth-child(4)').first().click();

// Validate the section has been duplicated with the identical name
await expect(page.getByRole('textbox', { name: 'Add Section Title' }).nth(1)).toHaveValue('Section 1');
await expect(page.getByRole('textbox', { name: 'Add Section Title' }).first()).toHaveValue('Section 1');

// Save Content
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(1000);
await page.locator('button').filter({ hasText: /^Save$/ }).click();
await page.waitForTimeout(2000);

});

test.skip('App Screen Builder - Section Deletion Button', async ({ page }) => {
  // Navigate to the login page
  await page.goto('https://cms.gc.uzgc2.com/');
  await page.getByRole('textbox', { name: 'Email * Email *' }).fill("automation@urbanzoo.io");
  await page.getByRole('textbox', { name: 'Password * Password *' }).fill('hsP25v9\\\\quT{');
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Navigate to App Screen Builder
  await page.getByRole('link', { name: 'Pages' }).click();
  await expect(page.locator('#app-screens')).toBeVisible();
  await page.locator('#app-screens').click();
  await page.locator('[id="__nuxt"]').getByText('Automation - Section Navigation', { exact: true }).click();
  await page.getByRole('button', { name: 'Edit' }).click();

// Ensure at least one section is visible
await expect(page.locator('.group\\/section').first()).toBeVisible();

const sections = page.locator('.group\\/section');
const initialCount = await sections.count();

const section = sections.first();
await section.hover();

// Delete one from the tab
await page.locator('button:nth-child(5)').first().click();
await page.locator('button:nth-child(5)').first().click();
await page.waitForTimeout(5000);

// Select Delete button from the side menu 
await page.locator('section').filter({ hasText: 'LayoutContentStyleSectionTab' }).getByRole('button').nth(1).click();
await page.locator('section').filter({ hasText: 'LayoutContentStyleSectionSection' }).getByRole('button').nth(1).click();

// Wait for 5s then save
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(1000);
await page.locator('button').filter({ hasText: /^Save$/ }).click();
await page.waitForTimeout(2000);
});

test.skip('App Screen Builder - Section Title Button', async ({ page }) => {
  // Navigate to the login page
await page.goto('https://cms.gc.uzgc2.com/');
await page.getByRole('textbox', { name: 'Email * Email *' }).fill("automation@urbanzoo.io");
await page.getByRole('textbox', { name: 'Password * Password *' }).fill('hsP25v9\\\\quT{');
await page.getByRole('button', { name: 'Sign in' }).click();

  // Navigate to App Screen Builder
await page.getByRole('link', { name: 'Pages' }).click();
await expect(page.locator('#app-screens')).toBeVisible();
await page.locator('#app-screens').click();
await page.locator('[id="__nuxt"]').getByText('Automation - Section Navigation', { exact: true }).click();
await page.getByRole('button', { name: 'Edit' }).click();

// Click the "Add Section" button
await page.getByText('Add Section').click();

// Focus and fill in the section title
await page.getByRole('textbox', { name: 'Add Section Title' }).dblclick();
await page.getByRole('textbox', { name: 'Add Section Title' }).fill('Section Title Button');

// Assert the textbox contains the correct value
await expect(page.getByRole('textbox', { name: 'Add Section Title' })).toHaveValue('Section Title Button');

// Click the clear button to remove the text
await page.locator('.text-2xl > div > .flex > button').first().click();

// Assert the textbox is cleared after clicking
await expect(page.getByRole('textbox', { name: 'Add Section Title' })).toBeEmpty();

// Assert the second button in the button group is visible
await expect(page.locator('.flex > .flex > button:nth-child(2)')).toBeVisible();

// Click the second button (e.g., cancel or close)
await page.locator('.flex > .flex > button:nth-child(2)').click();

// Add Section title box & add Title box text text
await page.getByRole('button', { name: 'Title' }).click();
await page.getByRole('textbox', { name: 'Add Section Title' }).fill('Title Box');
await expect(page.getByRole('textbox', { name: 'Add Section Title' })).toHaveValue('Title Box');

// Select the delete section option
await page.locator('.flex > .flex > button:nth-child(2)').click();
await page.locator('button:nth-child(6)').click();

// Wait for 5s then save
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(1000);
await page.locator('button').filter({ hasText: /^Save$/ }).click();
await page.waitForTimeout(2000);
});

test.skip('App Screen Builder - Section Add Carousel Option', async ({ page }) => {
// Navigate to the login page
await page.goto('https://cms.gc.uzgc2.com/');
await page.getByRole('textbox', { name: 'Email * Email *' }).fill("automation@urbanzoo.io");
await page.getByRole('textbox', { name: 'Password * Password *' }).fill('hsP25v9\\\\quT{');
await page.getByRole('button', { name: 'Sign in' }).click();

// Navigate to App Screen Builder
await page.getByRole('link', { name: 'Pages' }).click();
await expect(page.locator('#app-screens')).toBeVisible();
await page.locator('#app-screens').click();
await page.locator('[id="__nuxt"]').getByText('Automation - Section Navigation', { exact: true }).click();
await page.getByRole('button', { name: 'Edit' }).click();

// Add Section & Add Carousel option 
await page.getByText('Add Section').click();
await expect(page.locator('.relative > .relative > div > .gc-button').first()).toBeVisible();
await page.locator('.relative > .relative > div > .gc-button').first().click();


// CMS Corousel Content Validation
// Assert the "Content" heading is visible
await expect(page.getByRole('heading', { name: 'Content' })).toBeVisible();

// Verify an h3 element contains the text "Content"
await expect(page.locator('h3')).toContainText('Content');

// Assert "ContentTypes" text is visible on the page
await expect(page.getByText('ContentTypes')).toBeVisible();

// Verify the dialog contains "ContentTypes"
await expect(page.getByRole('dialog')).toContainText('ContentTypes');

// Ensure a specific element in the layout (possibly a list or column) is visible
await expect(page.locator('.w-\\[194px\\] > div:nth-child(4)')).toBeVisible();

// Assert "News" is present in the dialog
await expect(page.getByRole('dialog')).toContainText('News');

// Click the list item with the text "Videos"
await page.getByRole('listitem').filter({ hasText: 'Videos' }).click();

// Verify the "Videos" item is still visible after click
await expect(page.getByRole('listitem').filter({ hasText: 'Videos' })).toBeVisible();

// Check that "Fixture" list item is visible
await expect(page.getByRole('listitem').filter({ hasText: 'Fixture' })).toBeVisible();

// Confirm that the dialog now contains the text "Videos"
await expect(page.getByRole('dialog')).toContainText('Videos');

// Verify "Fixture" is still visible (redundant but ensures persistence)
await expect(page.getByRole('listitem').filter({ hasText: 'Fixture' })).toBeVisible();

});

test.skip('App Screen Builder - Section Add Single Item Option', async ({ page }) => {
  // Navigate to the login page
await page.goto('https://cms.gc.uzgc2.com/');
await page.getByRole('textbox', { name: 'Email * Email *' }).fill("automation@urbanzoo.io");
await page.getByRole('textbox', { name: 'Password * Password *' }).fill('hsP25v9\\\\quT{');
await page.getByRole('button', { name: 'Sign in' }).click();
  
  // Navigate to App Screen Builder
await page.getByRole('link', { name: 'Pages' }).click();
await expect(page.locator('#app-screens')).toBeVisible();
await page.locator('#app-screens').click();
await page.locator('[id="__nuxt"]').getByText('Automation - Section Navigation', { exact: true }).click();
await page.getByRole('button', { name: 'Edit' }).click();

// CMS - Add Single Item Option 
// Click the "Add Section" button
await page.getByText('Add Section').click();

// Verify the content type selector button is visible
await expect(page.locator('.relative > div:nth-child(2) > .gc-button')).toBeVisible();

// Click the content type selector button
await page.locator('.relative > div:nth-child(2) > .gc-button').click();

// Ensure "ContentTypes" label is visible
await expect(page.getByText('ContentTypes')).toBeVisible();

// Check that the dialog header includes "Content"
await expect(page.locator('h3')).toContainText('Content');

// Reconfirm "ContentTypes" is visible (may be redundant but ensures UI consistency)
await expect(page.getByText('ContentTypes')).toBeVisible();

// Verify "News" is displayed inside the dialog
await expect(page.getByRole('dialog')).toContainText('News');

// Confirm that the fourth child element in a specific layout is visible
await expect(page.locator('.w-\\[194px\\] > div:nth-child(4)')).toBeVisible();

// Ensure "Video" and "Fixture" list items are visible
await expect(page.getByRole('listitem').filter({ hasText: 'Video' })).toBeVisible();
await expect(page.getByRole('listitem').filter({ hasText: 'Fixture' })).toBeVisible();

// Select "Video" content type
await page.getByRole('listitem').filter({ hasText: 'Video' }).click();

// Select "Fixture" content type
await page.getByRole('listitem').filter({ hasText: 'Fixture' }).click();

// Verify the "Upcoming" section is visible after selecting content types
await expect(page.locator('div').filter({ hasText: /^Upcoming$/ }).locator('div').nth(3)).toBeVisible();

// Verify the "Result" section is visible after selecting content types
await expect(page.locator('div').filter({ hasText: /^Result$/ }).locator('div').nth(3)).toBeVisible();
});

test.skip('App Screen Builder - Section Add List Option', async ({ page }) => {
  // Navigate to the login page
await page.goto('https://cms.gc.uzgc2.com/');
await page.getByRole('textbox', { name: 'Email * Email *' }).fill("automation@urbanzoo.io");
await page.getByRole('textbox', { name: 'Password * Password *' }).fill('hsP25v9\\\\quT{');
await page.getByRole('button', { name: 'Sign in' }).click();
  
  // Navigate to App Screen Builder
await page.getByRole('link', { name: 'Pages' }).click();
await expect(page.locator('#app-screens')).toBeVisible();
await page.locator('#app-screens').click();
await page.locator('[id="__nuxt"]').getByText('Automation - Section Navigation', { exact: true }).click();
await page.getByRole('button', { name: 'Edit' }).click();
await page.getByText('Add Section').click();

// CMS - Add Single Item Option 
// Verify the third button (likely "Add" or "Edit") is visible
await expect(page.locator('div:nth-child(3) > .gc-button')).toBeVisible();

// Click the third button to open content configuration
await page.locator('div:nth-child(3) > .gc-button').click();

// Confirm the "Content" heading appears in the dialog
await expect(page.getByRole('heading', { name: 'Content' })).toBeVisible();

// Ensure "ContentTypes" label is visible
await expect(page.getByText('ContentTypes')).toBeVisible();

// Verify the dialog contains "ContentTypes"
await expect(page.getByRole('dialog')).toContainText('ContentTypes');

// Confirm a specific item layout (e.g., content type list) is visible
await expect(page.locator('.w-\\[194px\\] > div:nth-child(4)')).toBeVisible();

// Ensure "News" appears in the dialog content
await expect(page.getByRole('dialog')).toContainText('News');

// Verify "News" list item is present
await expect(page.getByRole('listitem').filter({ hasText: 'News' })).toBeVisible();

// Reconfirm "News" appears (ensures consistent UI state)
await expect(page.getByRole('dialog')).toContainText('News');

// Check that "Videos" list item is available
await expect(page.getByRole('listitem').filter({ hasText: 'Videos' })).toBeVisible();

// Click "Videos" to select it
await page.getByRole('listitem').filter({ hasText: 'Videos' }).click();

// Verify the "Videos" heading appears after selection
await expect(page.getByRole('heading', { name: 'Videos' })).toBeVisible();

// Confirm the dialog content includes "Videos"
await expect(page.getByRole('dialog')).toContainText('Videos');
});

test.skip('App Screen Builder - Section Add Content Option', async ({ page }) => {
  // Navigate to the login page
await page.goto('https://cms.gc.uzgc2.com/');
await page.getByRole('textbox', { name: 'Email * Email *' }).fill("automation@urbanzoo.io");
await page.getByRole('textbox', { name: 'Password * Password *' }).fill('hsP25v9\\\\quT{');
await page.getByRole('button', { name: 'Sign in' }).click();
  
  // Navigate to App Screen Builder
await page.getByRole('link', { name: 'Pages' }).click();
await expect(page.locator('#app-screens')).toBeVisible();
await page.locator('#app-screens').click();
await page.locator('[id="__nuxt"]').getByText('Automation - Section Navigation', { exact: true }).click();
await page.getByRole('button', { name: 'Edit' }).click();
await page.getByText('Add Section').click();

// Validate Text & options
await expect(page.locator('div:nth-child(4) > .gc-button')).toBeVisible();
await page.locator('div:nth-child(4) > .gc-button').click();
await expect(page.getByText('ContentTypes')).toBeVisible();
await expect(page.getByRole('dialog')).toContainText('Text');
await expect(page.locator('.w-\\[194px\\] > div:nth-child(4)')).toBeVisible();

// Validate Image Content & options
await page.getByRole('listitem').filter({ hasText: 'Image' }).click();
await expect(page.getByRole('listitem').filter({ hasText: 'Image' })).toBeVisible();
await expect(page.getByRole('dialog')).toContainText('Image');
await expect(page.locator('.w-\\[194px\\] > div:nth-child(4)')).toBeVisible();

// Validate Embed Content & options
await page.getByRole('listitem').filter({ hasText: 'Embed' }).click();
await expect(page.getByRole('listitem').filter({ hasText: 'Embed' })).toBeVisible();
await expect(page.getByRole('dialog')).toContainText('Embed');
await expect(page.locator('div').filter({ hasText: /^Social Media Embed$/ }).locator('div').nth(3)).toBeVisible();


// Validate Advert Content & options
await page.getByRole('listitem').filter({ hasText: 'Advert' }).click();
await expect(page.getByRole('listitem').filter({ hasText: 'Advert' })).toBeVisible();
await expect(page.getByRole('dialog')).toContainText('Advert');
await expect(page.locator('.w-\\[194px\\] > div:nth-child(4)')).toBeVisible();
await expect(page.getByRole('dialog')).toContainText('Advert');

// Validate Promo Content & options
await page.getByRole('listitem').filter({ hasText: 'Promo' }).click();
await expect(page.getByRole('listitem').filter({ hasText: 'Promo' })).toBeVisible();
await expect(page.locator('h2').filter({ hasText: 'Promo' })).toBeVisible();
await expect(page.locator('.w-\\[194px\\] > div:nth-child(4)')).toBeVisible();
await expect(page.getByRole('dialog')).toContainText('Promo');
await expect(page.getByRole('dialog')).toContainText('Promo');

// Validate Button Content & options
await expect(page.getByRole('listitem').filter({ hasText: 'Button' })).toBeVisible();
await page.getByRole('listitem').filter({ hasText: 'Button' }).click();
await expect(page.getByRole('dialog')).toContainText('Button');
await expect(page.locator('.w-\\[194px\\] > div:nth-child(4)')).toBeVisible();
await expect(page.getByRole('dialog')).toContainText('Button');
});