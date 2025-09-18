//npx playwright test "test/App Screen Builder/Content.spec" --headed 
import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

test('App Screen Builder - Content - Text - Left Aligned', async ({ page }) => {
  // Navigate to the login page..
await page.goto('https://cms.gc.uzgc2.com/');
await page.getByRole('textbox', { name: 'Email * Email *' }).fill("automation@urbanzoo.io");
await page.getByRole('textbox', { name: 'Password * Password *' }).fill('hsP25v9\\\\quT{');
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('link', { name: 'Pages' }).click();
await expect(page.locator('#app-screens')).toBeVisible();
await page.locator('#app-screens').click();
await page.locator('[id="__nuxt"]').getByText('Automation - Content').click();
await page.getByRole('button', { name: 'Edit' }).click();

// Add new section & add title
await page.locator('.p-2 > div:nth-child(2) > div > div:nth-child(2) > div > .flex').click();
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).dblclick();
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).fill('Content - Text - Left Aligned');


// Hover & select content option
await page.locator('div:nth-child(3) > div > div > div > div > div:nth-child(2) > .pt-0 > div:nth-child(2) > div > .group\\/hover-zone > div > .relative > div:nth-child(4) > .gc-button').click();
await page.waitForTimeout(5000);

// Validation Content Options
await expect(page.getByRole('listitem').filter({ hasText: 'Image' })).toBeVisible();
await expect(page.getByRole('listitem').filter({ hasText: 'Embed' })).toBeVisible();
await expect(page.getByRole('listitem').filter({ hasText: 'Advert' })).toBeVisible();
await expect(page.getByRole('listitem').filter({ hasText: 'Promo' })).toBeVisible();
await expect(page.getByRole('listitem').filter({ hasText: 'Button' })).toBeVisible();

// Select Text Content option 
await page.locator('.w-\\[194px\\] > div:nth-child(4)').click();

// Click Add to Canvas
await page.getByRole('button', { name: 'Add to Canvas' }).click();

// Enter Text under Paragraph
await page.locator('section').filter({ hasText: 'LayoutContentStyleContentParagraphParagraphHeading 2Heading 3Heading 4Heading' }).getByRole('textbox').click();
await page.locator('section').filter({ hasText: 'LayoutContentStyleContentParagraphParagraphHeading 2Heading 3Heading 4Heading' }).getByRole('textbox').fill('Heading = Paragraph');

// Hover & select content option
await page.locator('.w-full.group\\/section.rounded-md.rounded-b-md > .relative.transition-all.duration-200 > .pt-0 > div:nth-child(2) > .flex.items-center.justify-center.z-\\[10\\] > .group\\/hover-zone > .relative.flex.items-center.justify-center > .relative > div:nth-child(4) > .gc-button').click();
await page.locator('.w-\\[194px\\] > div:nth-child(4)').click();
await page.getByRole('button', { name: 'Add to Canvas' }).click();

// Select Heading 2 dropdown & select Heading 2 & add text Heading 2
await page.locator('.relative.flex.items-center.justify-between.gap-1 > div:nth-child(2)').first().click();
await page.getByRole('listitem').filter({ hasText: 'Heading 2' }).locator('div').click();
await page.locator('section').filter({ hasText: 'LayoutContentStyleContentHeading 2ParagraphHeading 2Heading 3Heading 4Heading' }).getByRole('heading').dblclick();
await page.locator('section').filter({ hasText: 'LayoutContentStyleContentHeading 2ParagraphHeading 2Heading 3Heading 4Heading' }).getByRole('textbox').fill('Heading 2');

// Hover & select Content List
await page.locator('.w-full.group\\/section.rounded-md.rounded-b-md > .relative.transition-all.duration-200 > .pt-0 > div:nth-child(2) > .flex.items-center.justify-center.z-\\[10\\] > .group\\/hover-zone > .relative.flex.items-center.justify-center > .relative > div:nth-child(4) > .gc-button').click();

// Select Text Content option 
await page.locator('.w-\\[194px\\] > div:nth-child(4)').click();

// Click Add to Canvas
await page.getByRole('button', { name: 'Add to Canvas' }).click();

// Select Heading 3 dropdown & select Heading 3 & add text Heading 3
await page.locator('.relative.flex.items-center.justify-between.gap-1 > div:nth-child(2)').first().click();
await page.getByRole('listitem').filter({ hasText: 'Heading 3' }).locator('div').click();
await page.locator('section').filter({ hasText: 'LayoutContentStyleContentHeading 3ParagraphHeading 2Heading 3Heading 4Heading' }).getByRole('textbox').fill('Heading 3');

// Hover & select Content List / Select Text & Add to Canvas
await page.locator('.w-full.group\\/section.rounded-md.rounded-b-md > .relative.transition-all.duration-200 > .pt-0 > div:nth-child(2) > .flex.items-center.justify-center.z-\\[10\\] > .group\\/hover-zone > .relative.flex.items-center.justify-center > .relative > div:nth-child(4) > .gc-button').click();await page.locator('.w-\\[194px\\] > div:nth-child(4)').click();
await page.getByRole('button', { name: 'Add to Canvas' }).click();

// Select Heading 4 dropdown & select Heading 4 & add text Heading 4
await page.locator('.relative.flex.items-center.justify-between.gap-1 > div:nth-child(2)').first().click();
await page.getByRole('listitem').filter({ hasText: 'Heading 4' }).locator('div').click();
await page.locator('section').filter({ hasText: 'LayoutContentStyleContentHeading 4ParagraphHeading 2Heading 3Heading 4Heading' }).getByRole('textbox').fill('Heading 4');

// Hover & select Content List & Select Text Content option & Click Add to Canvas
await page.locator('.w-full.group\\/section.rounded-md.rounded-b-md > .relative.transition-all.duration-200 > .pt-0 > div:nth-child(2) > .flex.items-center.justify-center.z-\\[10\\] > .group\\/hover-zone > .relative.flex.items-center.justify-center > .relative > div:nth-child(4) > .gc-button').click();await page.locator('.w-\\[194px\\] > div:nth-child(4)').click();
await page.locator('.w-\\[194px\\] > div:nth-child(4)').click();
await page.getByRole('button', { name: 'Add to Canvas' }).click();

// Select Heading 5 dropdown & select Heading 5 & add text Heading 5
await page.locator('.relative.flex.items-center.justify-between.gap-1 > div:nth-child(2)').first().click();
await page.getByRole('listitem').filter({ hasText: 'Heading 5' }).locator('div').click();
await page.locator('section').filter({ hasText: 'LayoutContentStyleContentHeading 5ParagraphHeading 2Heading 3Heading 4Heading' }).getByRole('textbox').fill('Heading 5');

// Hover & select Content List & Select Text Content option & Click Add to Canvas
await page.locator('.w-full.group\\/section.rounded-md.rounded-b-md > .relative.transition-all.duration-200 > .pt-0 > div:nth-child(2) > .flex.items-center.justify-center.z-\\[10\\] > .group\\/hover-zone > .relative.flex.items-center.justify-center > .relative > div:nth-child(4) > .gc-button').click();await page.locator('.w-\\[194px\\] > div:nth-child(4)').click();
await page.locator('.w-\\[194px\\] > div:nth-child(4)').click();
await page.getByRole('button', { name: 'Add to Canvas' }).click();

// Select Heading 6 dropdown  & select Heading 6 & add text Heading 6
await page.locator('.relative.flex.items-center.justify-between.gap-1 > div:nth-child(2)').first().click();
await page.getByRole('listitem').filter({ hasText: 'Heading 6' }).locator('div').click();
await page.locator('section').filter({ hasText: 'LayoutContentStyleContentHeading 6ParagraphHeading 2Heading 3Heading 4Heading' }).getByRole('heading').click();
await page.locator('section').filter({ hasText: 'LayoutContentStyleContentHeading 6ParagraphHeading 2Heading 3Heading 4Heading' }).getByRole('textbox').fill('Heading 6');

// Save Content
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(1000);
await page.locator('button').filter({ hasText: /^Save$/ }).click();
await page.waitForTimeout(2000);

// Clean Uo Script
await page.getByText('Section', { exact: true }).nth(1).click();
await page.locator('[id="__nuxt"] span').filter({ hasText: /^Automation - Content$/ }).click();
await page.locator('section').filter({ hasText: 'LayoutContentStyleSection' }).getByRole('button').nth(3).click();
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(1000);
await page.locator('button').filter({ hasText: /^Save$/ }).click();
await page.waitForTimeout(2000);
});

test('App Screen Builder - Content - Text - Centre Aligned', async ({ page }) => {
  // Navigate to the login page..
await page.goto('https://cms.gc.uzgc2.com/');
await page.getByRole('textbox', { name: 'Email * Email *' }).fill("automation@urbanzoo.io");
await page.getByRole('textbox', { name: 'Password * Password *' }).fill('hsP25v9\\\\quT{');
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('link', { name: 'Pages' }).click();
await expect(page.locator('#app-screens')).toBeVisible();
await page.locator('#app-screens').click();
await page.locator('[id="__nuxt"]').getByText('Automation - Content').click();
await page.getByRole('button', { name: 'Edit' }).click();

// Add new section & add title
await page.locator('.p-2 > div:nth-child(2) > div > div:nth-child(2) > div > .flex').click();
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).dblclick();
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).fill('Content - Text - Centre Aligned');

// Hover & select content option
await page.locator('div:nth-child(3) > div > div > div > div > div:nth-child(2) > .pt-0 > div:nth-child(2) > div > .group\\/hover-zone > div > .relative > div:nth-child(4) > .gc-button').click();
await page.waitForTimeout(5000);

// Select Text Content option 
await page.locator('.w-\\[194px\\] > div:nth-child(4)').click();

// Click Add to Canvas
await page.getByRole('button', { name: 'Add to Canvas' }).click();

// Enter Text under Paragraph
await page.locator('section').filter({ hasText: 'LayoutContentStyleContentParagraphParagraphHeading 2Heading 3Heading 4Heading' }).getByRole('textbox').click();
await page.locator('section').filter({ hasText: 'LayoutContentStyleContentParagraphParagraphHeading 2Heading 3Heading 4Heading' }).getByRole('textbox').fill('Heading = Paragraph');
await page.locator('div:nth-child(2) > div:nth-child(2) > button:nth-child(2)').click();

 
// Hover & select content option
await page.locator('div:nth-child(3) > div > div > div > div > div:nth-child(2) > .pt-0 > div:nth-child(2) > div > .group\\/hover-zone > div > .relative > div:nth-child(4) > .gc-button').click();
await page.locator('.w-\\[194px\\] > div:nth-child(4)').click();
await page.getByRole('button', { name: 'Add to Canvas' }).click();

// Select Heading 2 dropdown & select Heading 2 & add text Heading 2
await page.locator('.relative.flex.items-center.justify-between.gap-1 > div:nth-child(2)').first().click();
await page.getByRole('listitem').filter({ hasText: 'Heading 2' }).locator('div').click();
await page.locator('section').filter({ hasText: 'LayoutContentStyleContentHeading 2ParagraphHeading 2Heading 3Heading 4Heading' }).getByRole('heading').dblclick();
await page.locator('section').filter({ hasText: 'LayoutContentStyleContentHeading 2ParagraphHeading 2Heading 3Heading 4Heading' }).getByRole('textbox').fill('Heading 2');
await page.locator('div:nth-child(2) > div:nth-child(2) > button:nth-child(2)').click();


// Hover & select Content List
await page.locator('div:nth-child(3) > div > div > div > div > div:nth-child(2) > .pt-0 > div:nth-child(2) > div > .group\\/hover-zone > div > .relative > div:nth-child(4) > .gc-button').click();

// Select Text Content option 
await page.locator('.w-\\[194px\\] > div:nth-child(4)').click();

// Click Add to Canvas
await page.getByRole('button', { name: 'Add to Canvas' }).click();

// Select Heading 3 dropdown & select Heading 3 & add text Heading 3
await page.locator('.relative.flex.items-center.justify-between.gap-1 > div:nth-child(2)').first().click();
await page.getByRole('listitem').filter({ hasText: 'Heading 3' }).locator('div').click();
await page.locator('section').filter({ hasText: 'LayoutContentStyleContentHeading 3ParagraphHeading 2Heading 3Heading 4Heading' }).getByRole('textbox').fill('Heading 3');
await page.locator('div:nth-child(2) > div:nth-child(2) > button:nth-child(2)').click();

// Hover & select Content List / Select Text & Add to Canvas
await page.locator('div:nth-child(3) > div > div > div > div > div:nth-child(2) > .pt-0 > div:nth-child(2) > div > .group\\/hover-zone > div > .relative > div:nth-child(4) > .gc-button').click();
await page.locator('.w-\\[194px\\] > div:nth-child(4)').click();
await page.getByRole('button', { name: 'Add to Canvas' }).click();

// Select Heading 4 dropdown & select Heading 4 & add text Heading 4
await page.locator('.relative.flex.items-center.justify-between.gap-1 > div:nth-child(2)').first().click();
await page.getByRole('listitem').filter({ hasText: 'Heading 4' }).locator('div').click();
await page.locator('section').filter({ hasText: 'LayoutContentStyleContentHeading 4ParagraphHeading 2Heading 3Heading 4Heading' }).getByRole('textbox').fill('Heading 4');
await page.locator('div:nth-child(2) > div:nth-child(2) > button:nth-child(2)').click();

// Hover & select Content List & Select Text Content option & Click Add to Canvas
await page.locator('div:nth-child(3) > div > div > div > div > div:nth-child(2) > .pt-0 > div:nth-child(2) > div > .group\\/hover-zone > div > .relative > div:nth-child(4) > .gc-button').click();
await page.locator('.w-\\[194px\\] > div:nth-child(4)').click();
await page.getByRole('button', { name: 'Add to Canvas' }).click();

// Select Heading 5 dropdown & select Heading 5 & add text Heading 5
await page.locator('.relative.flex.items-center.justify-between.gap-1 > div:nth-child(2)').first().click();
await page.getByRole('listitem').filter({ hasText: 'Heading 5' }).locator('div').click();
await page.locator('section').filter({ hasText: 'LayoutContentStyleContentHeading 5ParagraphHeading 2Heading 3Heading 4Heading' }).getByRole('textbox').fill('Heading 5');
await page.locator('div:nth-child(2) > div:nth-child(2) > button:nth-child(2)').click();

// Hover & select Content List & Select Text Content option & Click Add to Canvas
await page.locator('div:nth-child(3) > div > div > div > div > div:nth-child(2) > .pt-0 > div:nth-child(2) > div > .group\\/hover-zone > div > .relative > div:nth-child(4) > .gc-button').click();
await page.locator('.w-\\[194px\\] > div:nth-child(4)').click();
await page.getByRole('button', { name: 'Add to Canvas' }).click();

// Select Heading 6 dropdown  & select Heading 6 & add text Heading 6
await page.locator('.relative.flex.items-center.justify-between.gap-1 > div:nth-child(2)').first().click();
await page.getByRole('listitem').filter({ hasText: 'Heading 6' }).locator('div').click();
await page.locator('section').filter({ hasText: 'LayoutContentStyleContentHeading 6ParagraphHeading 2Heading 3Heading 4Heading' }).getByRole('heading').click();
await page.locator('section').filter({ hasText: 'LayoutContentStyleContentHeading 6ParagraphHeading 2Heading 3Heading 4Heading' }).getByRole('textbox').fill('Heading 6');
await page.locator('div:nth-child(2) > div:nth-child(2) > button:nth-child(2)').click();

// Clean Uo Script
await page.getByText('Section', { exact: true }).nth(1).click();
await page.locator('[id="__nuxt"] span').filter({ hasText: /^Automation - Content$/ }).click();
await page.locator('section').filter({ hasText: 'LayoutContentStyleSection' }).getByRole('button').nth(3).click();
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(2000);
await page.locator('button').filter({ hasText: /^Save$/ }).click();
});

test('App Screen Builder - Content - Text - Right Aligned', async ({ page }) => {
  // Navigate to the login page..
await page.goto('https://cms.gc.uzgc2.com/');
await page.getByRole('textbox', { name: 'Email * Email *' }).fill("automation@urbanzoo.io");
await page.getByRole('textbox', { name: 'Password * Password *' }).fill('hsP25v9\\\\quT{');
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('link', { name: 'Pages' }).click();
await expect(page.locator('#app-screens')).toBeVisible();
await page.locator('#app-screens').click();
await page.locator('[id="__nuxt"]').getByText('Automation - Content').click();
await page.getByRole('button', { name: 'Edit' }).click();

// Add new section & add title
await page.locator('.p-2 > div:nth-child(2) > div > div:nth-child(2) > div > .flex').click();
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).dblclick();
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).fill('Content - Text - Right Aligned');


// Hover & select content option
await page.locator('div:nth-child(3) > div > div > div > div > div:nth-child(2) > .pt-0 > div:nth-child(2) > div > .group\\/hover-zone > div > .relative > div:nth-child(4) > .gc-button').click();
await page.waitForTimeout(5000);

// Select Text Content option 
await page.locator('.w-\\[194px\\] > div:nth-child(4)').click();

// Click Add to Canvas
await page.getByRole('button', { name: 'Add to Canvas' }).click();

// Enter Text under Paragraph
await page.locator('section').filter({ hasText: 'LayoutContentStyleContentParagraphParagraphHeading 2Heading 3Heading 4Heading' }).getByRole('textbox').click();
await page.locator('section').filter({ hasText: 'LayoutContentStyleContentParagraphParagraphHeading 2Heading 3Heading 4Heading' }).getByRole('textbox').fill('Heading = Paragraph');
await page.locator('div:nth-child(2) > button:nth-child(3)').click();
 
// Hover & select content option
await page.locator('div:nth-child(3) > div > div > div > div > div:nth-child(2) > .pt-0 > div:nth-child(2) > div > .group\\/hover-zone > div > .relative > div:nth-child(4) > .gc-button').click();
await page.locator('.w-\\[194px\\] > div:nth-child(4)').click();
await page.getByRole('button', { name: 'Add to Canvas' }).click();

// Select Heading 2 dropdown & select Heading 2 & add text Heading 2
await page.locator('.relative.flex.items-center.justify-between.gap-1 > div:nth-child(2)').first().click();
await page.getByRole('listitem').filter({ hasText: 'Heading 2' }).locator('div').click();
await page.locator('section').filter({ hasText: 'LayoutContentStyleContentHeading 2ParagraphHeading 2Heading 3Heading 4Heading' }).getByRole('heading').dblclick();
await page.locator('section').filter({ hasText: 'LayoutContentStyleContentHeading 2ParagraphHeading 2Heading 3Heading 4Heading' }).getByRole('textbox').fill('Heading 2');
await page.locator('div:nth-child(2) > button:nth-child(3)').click();

// Hover & select Content List
await page.locator('div:nth-child(3) > div > div > div > div > div:nth-child(2) > .pt-0 > div:nth-child(2) > div > .group\\/hover-zone > div > .relative > div:nth-child(4) > .gc-button').click();

// Select Text Content option 
await page.locator('.w-\\[194px\\] > div:nth-child(4)').click();

// Click Add to Canvas
await page.getByRole('button', { name: 'Add to Canvas' }).click();

// Select Heading 3 dropdown & select Heading 3 & add text Heading 3
await page.locator('.relative.flex.items-center.justify-between.gap-1 > div:nth-child(2)').first().click();
await page.getByRole('listitem').filter({ hasText: 'Heading 3' }).locator('div').click();
await page.locator('section').filter({ hasText: 'LayoutContentStyleContentHeading 3ParagraphHeading 2Heading 3Heading 4Heading' }).getByRole('textbox').fill('Heading 3');
await page.locator('div:nth-child(2) > button:nth-child(3)').click();

// Hover & select Content List / Select Text & Add to Canvas
await page.locator('.w-full.group\\/section.rounded-md.rounded-b-md > .relative.transition-all.duration-200 > .pt-0 > div:nth-child(2) > .flex.items-center.justify-center.z-\\[10\\] > .group\\/hover-zone > .relative.flex.items-center.justify-center > .relative > div:nth-child(4) > .gc-button').click();await page.locator('.w-\\[194px\\] > div:nth-child(4)').click();
await page.getByRole('button', { name: 'Add to Canvas' }).click();

// Select Heading 4 dropdown & select Heading 4 & add text Heading 4
await page.locator('.relative.flex.items-center.justify-between.gap-1 > div:nth-child(2)').first().click();
await page.getByRole('listitem').filter({ hasText: 'Heading 4' }).locator('div').click();
await page.locator('section').filter({ hasText: 'LayoutContentStyleContentHeading 4ParagraphHeading 2Heading 3Heading 4Heading' }).getByRole('textbox').fill('Heading 4');
await page.locator('div:nth-child(2) > button:nth-child(3)').click();

// Hover & select Content List & Select Text Content option & Click Add to Canvas
await page.locator('.w-full.group\\/section.rounded-md.rounded-b-md > .relative.transition-all.duration-200 > .pt-0 > div:nth-child(2) > .flex.items-center.justify-center.z-\\[10\\] > .group\\/hover-zone > .relative.flex.items-center.justify-center > .relative > div:nth-child(4) > .gc-button').click();await page.locator('.w-\\[194px\\] > div:nth-child(4)').click();
await page.locator('.w-\\[194px\\] > div:nth-child(4)').click();
await page.getByRole('button', { name: 'Add to Canvas' }).click();

// Select Heading 5 dropdown & select Heading 5 & add text Heading 5
await page.locator('.relative.flex.items-center.justify-between.gap-1 > div:nth-child(2)').first().click();
await page.getByRole('listitem').filter({ hasText: 'Heading 5' }).locator('div').click();
await page.locator('section').filter({ hasText: 'LayoutContentStyleContentHeading 5ParagraphHeading 2Heading 3Heading 4Heading' }).getByRole('textbox').fill('Heading 5');
await page.locator('div:nth-child(2) > button:nth-child(3)').click();

// Hover & select Content List & Select Text Content option & Click Add to Canvas
await page.locator('.w-full.group\\/section.rounded-md.rounded-b-md > .relative.transition-all.duration-200 > .pt-0 > div:nth-child(2) > .flex.items-center.justify-center.z-\\[10\\] > .group\\/hover-zone > .relative.flex.items-center.justify-center > .relative > div:nth-child(4) > .gc-button').click();await page.locator('.w-\\[194px\\] > div:nth-child(4)').click();
await page.locator('.w-\\[194px\\] > div:nth-child(4)').click();
await page.getByRole('button', { name: 'Add to Canvas' }).click();

// Select Heading 6 dropdown  & select Heading 6 & add text Heading 6
await page.locator('.relative.flex.items-center.justify-between.gap-1 > div:nth-child(2)').first().click();
await page.getByRole('listitem').filter({ hasText: 'Heading 6' }).locator('div').click();
await page.locator('section').filter({ hasText: 'LayoutContentStyleContentHeading 6ParagraphHeading 2Heading 3Heading 4Heading' }).getByRole('heading').click();
await page.locator('section').filter({ hasText: 'LayoutContentStyleContentHeading 6ParagraphHeading 2Heading 3Heading 4Heading' }).getByRole('textbox').fill('Heading 6');
await page.locator('div:nth-child(2) > button:nth-child(3)').click();

// Save Content
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(1000);
await page.locator('button').filter({ hasText: /^Save$/ }).click();
await page.waitForTimeout(2000);

// Clean Uo Script
await page.getByText('Section', { exact: true }).nth(1).click();
await page.locator('[id="__nuxt"] span').filter({ hasText: /^Automation - Content$/ }).click();
await page.locator('section').filter({ hasText: 'LayoutContentStyleSection' }).getByRole('button').nth(3).click();
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(1000);
await page.locator('button').filter({ hasText: /^Save$/ }).click();
await page.waitForTimeout(5000);
});

test('App Screen Builder - Content - Image', async ({ page }) => {
  // Navigate to the login page..
await page.goto('https://cms.gc.uzgc2.com/');
await page.getByRole('textbox', { name: 'Email * Email *' }).fill("automation@urbanzoo.io");
await page.getByRole('textbox', { name: 'Password * Password *' }).fill('hsP25v9\\\\quT{');
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('link', { name: 'Pages' }).click();
await expect(page.locator('#app-screens')).toBeVisible();
await page.locator('#app-screens').click();
await page.locator('[id="__nuxt"]').getByText('Automation - Content').click();
await page.getByRole('button', { name: 'Edit' }).click();

// Add new section & add title
await page.locator('.p-2 > div:nth-child(2) > div > div:nth-child(2) > div > .flex').click();
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).dblclick();
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).fill('Content - Image');

// Hover & select content option 
await page.locator('div:nth-child(3) > div > div > div > div > div:nth-child(2) > .pt-0 > div:nth-child(2) > div > .group\\/hover-zone > div > .relative > div:nth-child(4) > .gc-button').click();


// Select Image 
await page.getByRole('listitem').filter({ hasText: 'Image' }).click();
await expect(page.locator('.w-\\[194px\\] > div:nth-child(4)')).toBeVisible();
await expect(page.getByRole('dialog')).toContainText('Image');

// Select Add to Canvas
await page.getByRole('button', { name: 'Add to Canvas' }).click();
await page.waitForTimeout(5000);


// Select Image & Validate button 
await page.getByRole('button', { name: 'Select File' }).click();
await expect(page.getByRole('button', { name: 'Select File' })).toBeVisible();
await page.locator('div:nth-child(55) > div > .w-full').click();


// Select image to Add to canvas
await page.getByRole('button', { name: 'Add To Canvas' }).click();
await page.waitForTimeout(5000);

// Clean Up Script 
await page.locator('[id="__nuxt"] span').filter({ hasText: /^Automation - Content$/ }).click();
await page.locator('section').filter({ hasText: 'LayoutContentStyleSection' }).getByRole('button').nth(3).click();
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(1000);
await page.locator('button').filter({ hasText: /^Save$/ }).click();
await page.waitForTimeout(2000);
});

test('App Screen Builder - Content - Advert', async ({ page }) => {
  // Navigate to the login page..
await page.goto('https://cms.gc.uzgc2.com/');
await page.getByRole('textbox', { name: 'Email * Email *' }).fill("automation@urbanzoo.io");
await page.getByRole('textbox', { name: 'Password * Password *' }).fill('hsP25v9\\\\quT{');
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('link', { name: 'Pages' }).click();
await expect(page.locator('#app-screens')).toBeVisible();
await page.locator('#app-screens').click();
await page.locator('[id="__nuxt"]').getByText('Automation - Content').click();
await page.getByRole('button', { name: 'Edit' }).click();

// Add section & add title 
await page.locator('.p-2 > div:nth-child(2) > div > div:nth-child(2) > div > .flex').click();
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).click();
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).fill('Content - Advert');

// Hover & Select Add Content
await page.locator('div:nth-child(3) > div > div > div > div > div:nth-child(2) > .pt-0 > div:nth-child(2) > div > .group\\/hover-zone > div > .relative > div:nth-child(4) > .gc-button').click();

// Click Advert Section & add validation
await page.getByRole('listitem').filter({ hasText: 'Advert' }).click();
await expect(page.locator('.w-\\[194px\\] > div:nth-child(4)')).toBeVisible();
await expect(page.getByRole('dialog')).toContainText('Advert');
await page.waitForTimeout(5000);

// Click Add to Canvas
await page.getByRole('button', { name: 'Add to Canvas' }).click();

// Select & Click Add slot dropdown 
await page.locator('div').filter({ hasText: /^Select an Option$/ }).nth(1).click();

// Select & Add slot
await page.getByRole('listitem').filter({ hasText: 'Generic content page' }).locator('div').click();
await page.waitForTimeout(5000);

// Ad Slot Validation 
await expect(page.locator('.z-\\[1\\]').first()).toBeVisible();
await expect(page.getByRole('list')).toContainText('Ad Slot');
await expect(page.getByText('Ad Slot').nth(3)).toBeVisible();
await expect(page.locator('[id="__nuxt"] div').filter({ hasText: /^Generic content page$/ }).nth(3)).toBeVisible();

// Save Content of the Ad Slot
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(2000);
await page.locator('button').filter({ hasText: /^Save$/ }).click();

// Clean Up Script
await page.locator('[id="__nuxt"] span').filter({ hasText: /^Automation - Content$/ }).click();
await page.locator('section').filter({ hasText: 'LayoutContentStyleSection' }).getByRole('button').nth(3).click();
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(2000);
await page.locator('button').filter({ hasText: /^Save$/ }).click();
await page.waitForTimeout(5000);
});

test('App Screen Builder - Content - Promo', async ({ page }) => {
  // Navigate to the login page..
await page.goto('https://cms.gc.uzgc2.com/');
await page.getByRole('textbox', { name: 'Email * Email *' }).fill("automation@urbanzoo.io");
await page.getByRole('textbox', { name: 'Password * Password *' }).fill('hsP25v9\\\\quT{');
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('link', { name: 'Pages' }).click();
await expect(page.locator('#app-screens')).toBeVisible();
await page.locator('#app-screens').click();
await page.locator('[id="__nuxt"]').getByText('Automation - Content').click();
await page.getByRole('button', { name: 'Edit' }).click();

// Add section & add title Content - Promo
await page.locator('.p-2 > div:nth-child(2) > div > div:nth-child(2) > div > .flex').click();
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).click();
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).fill('Content - Promo');

// Hover & Select Add Content & select Promo
await page.locator('div:nth-child(3) > div > div > div > div > div:nth-child(2) > .pt-0 > div:nth-child(2) > div > .group\\/hover-zone > div > .relative > div:nth-child(4) > .gc-button').click();
await page.getByRole('listitem').filter({ hasText: 'Promo' }).click();

// Promo Validation 
await page.getByRole('listitem').filter({ hasText: 'Promo' }).click();
await expect(page.getByRole('dialog').locator('h2')).toBeVisible();
await expect(page.locator('.w-\\[194px\\] > div:nth-child(4)')).toBeVisible();
await expect(page.getByRole('listitem').filter({ hasText: 'Promo' })).toBeVisible();
await expect(page.getByRole('dialog')).toContainText('Promo');
await expect(page.getByRole('dialog')).toContainText('Promo');

// Click button to Add to Canvas
await page.getByRole('button', { name: 'Add to Canvas' }).click();
await page.waitForTimeout(5000);

// Promo Validation
await expect(page.getByRole('heading', { name: 'Promo' })).toBeVisible();
await expect(page.locator('[id="__nuxt"]')).toContainText('Promo');
await expect(page.getByRole('list')).toContainText('Promo');
await expect(page.getByText('Title')).toBeVisible();
await expect(page.locator('[id="__nuxt"]')).toContainText('Title');
await expect(page.getByText('Description')).toBeVisible();
await expect(page.locator('[id="__nuxt"]')).toContainText('Description');

// Add Title
await page.locator('div').filter({ hasText: /^ContentTitleDescription$/ }).locator('input[type="input"]').click();
await page.locator('div').filter({ hasText: /^ContentTitleDescription$/ }).locator('input[type="input"]').fill('Automation Title');

// Add Description
await page.locator('textarea').click();
await page.locator('textarea').fill('Automation Description');
await expect(page.locator('textarea')).toHaveValue('Automation Description');
await expect(page.locator('div').filter({ hasText: /^ContentTitleDescription$/ }).locator('input[type="input"]')).toHaveValue('Automation Title');

// Add Image
await page.getByRole('button', { name: 'Select File' }).click();
await page.locator('div:nth-child(55) > div > .w-full').click();
await page.getByRole('button', { name: 'Add To Canvas' }).click();
await expect(page.locator('section').filter({ hasText: 'LayoutContentStyleContentTitleDescriptionImageButtonsButton 1 TextButton 1' }).locator('img')).toBeVisible();

// Add Button 1 Text & URL 
await page.getByRole('textbox', { name: 'Button Text' }).first().click();
await page.getByRole('textbox', { name: 'Button Text' }).first().fill('Button Text 1');
await expect(page.getByRole('textbox', { name: 'Button Text' }).first()).toHaveValue('Button Text 1');
await expect(page.getByText('Button 1 URL')).toBeVisible();
await page.getByRole('textbox', { name: 'e.g. https://www.google.com/' }).first().click();
await page.getByRole('textbox', { name: 'e.g. https://www.google.com/' }).first().fill('https://urbanzoo.io/');
await expect(page.getByRole('textbox', { name: 'e.g. https://www.google.com/' }).first()).toHaveValue('https://urbanzoo.io/');

// Add Button 2 Text & URL 
await expect(page.getByText('Button 2 Text')).toBeVisible();
await expect(page.getByText('Button 2 URL')).toBeVisible();
await page.getByRole('textbox', { name: 'Button Text' }).nth(1).click();
await page.getByRole('textbox', { name: 'Button Text' }).nth(1).fill('Button Text 2');
await page.getByRole('textbox', { name: 'e.g. https://www.google.com/' }).nth(1).dblclick();
await page.getByRole('textbox', { name: 'e.g. https://www.google.com/' }).nth(1).fill('https://urbanzoo.io/');
await expect(page.getByRole('textbox', { name: 'Button Text' }).nth(1)).toHaveValue('Button Text 2');
await expect(page.getByRole('textbox', { name: 'e.g. https://www.google.com/' }).nth(1)).toHaveValue('https://urbanzoo.io/');

// Save Content of the Promo
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(2000);
await page.locator('button').filter({ hasText: /^Save$/ }).click();
await page.waitForTimeout(5000);

// Clean Up Script
await page.locator('[id="__nuxt"] span').filter({ hasText: /^Automation - Content$/ }).click();
await page.locator('section').filter({ hasText: 'LayoutContentStyleSection' }).getByRole('button').nth(3).click();
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(2000);
await page.locator('button').filter({ hasText: /^Save$/ }).click();
await page.waitForTimeout(5000);
});

test('App Screen Builder - Content - Button', async ({ page }) => {
  // Navigate to the login page..
await page.goto('https://cms.gc.uzgc2.com/');
await page.getByRole('textbox', { name: 'Email * Email *' }).fill("automation@urbanzoo.io");
await page.getByRole('textbox', { name: 'Password * Password *' }).fill('hsP25v9\\\\quT{');
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('link', { name: 'Pages' }).click();
await expect(page.locator('#app-screens')).toBeVisible();
await page.locator('#app-screens').click();
await page.locator('[id="__nuxt"]').getByText('Automation - Content').click();
await page.getByRole('button', { name: 'Edit' }).click();

// Add section & add title Content - Promo
await page.locator('.p-2 > div:nth-child(2) > div > div:nth-child(2) > div > .flex').click();
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).click();
await page.getByRole('textbox', { name: 'Add Section Title' }).nth(1).fill('Content - Button');

// Hover & Select Add Content & select Promo
await page.locator('div:nth-child(3) > div > div > div > div > div:nth-child(2) > .pt-0 > div:nth-child(2) > div > .group\\/hover-zone > div > .relative > div:nth-child(4) > .gc-button').click();

// Click Button & Validate Button text
await expect(page.getByRole('listitem').filter({ hasText: 'Button' })).toBeVisible();
await page.getByRole('listitem').filter({ hasText: 'Button' }).click();
await expect(page.getByRole('dialog').locator('h2')).toBeVisible();
await expect(page.getByRole('dialog')).toContainText('Button');

// Click Add to Canvas
await page.getByRole('button', { name: 'Add to Canvas' }).click();
await expect(page.getByRole('heading', { name: 'Button' }).locator('span')).toBeVisible();
await expect(page.getByText('Button Text')).toBeVisible();
await expect(page.getByText('Link', { exact: true })).toBeVisible();

// Add Button Text & URL 
await page.getByRole('textbox', { name: 'Button Text' }).click();
await page.getByRole('textbox', { name: 'Button Text' }).fill('Button Text ');

// Save Content of the Promo
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(2000);
await page.locator('button').filter({ hasText: /^Save$/ }).click();
await page.waitForTimeout(5000);

// Clean Up Script
await page.locator('[id="__nuxt"] span').filter({ hasText: /^Automation - Content$/ }).click();
await page.locator('section').filter({ hasText: 'LayoutContentStyleSection' }).getByRole('button').nth(3).click();
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(2000);
await page.locator('button').filter({ hasText: /^Save$/ }).click();
await page.waitForTimeout(5000);
});
