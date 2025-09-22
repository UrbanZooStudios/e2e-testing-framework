// npx playwright test "test/Fanside/Fanside Yonex All England.spec.ts" --headed

import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();
const previewUsername = process.env.PREVIEW_USERNAME || 'urbanzoo';
const previewPassword = process.env.PREVIEW_PASSWORD || 'gamechanger1!';



test('Yonex Site Map Validation', async ({ browser }) => {
    test.setTimeout(120000);
  
const context = await browser.newContext({
    httpCredentials: {
    username: previewUsername,
    password: previewPassword,
},
});
  
const page = await context.newPage();
await page.goto('https://beta.badmintonengland.co.uk/allengland');  
await page.getByRole('button', { name: 'Accept All Cookies' }).click();
await page.getByRole('banner').filter({ hasText: 'THE ONE TO WIN | Tuesday 3rd' }).getByLabel('Burger Menu').click();
  
const siteMapList = page.getByRole('navigation').filter({ has: page.getByRole('tab', { name: 'News' }) }).getByRole('list').first();  
const items = siteMapList.getByRole('tab');
  
// Debug info
const count = await items.count();console.log(`Found ${count} site map items`);
  
// Assert count + exact labels
await expect(items).toHaveText([
    'News',
    'Watch',
    'Tickets',
    'Volunteer',
    'Contact Us',
]);
});

test('Yonex Site Map Menu Font Validation', async ({ browser }) => {
    test.setTimeout(120000);
  
    const context = await browser.newContext({
      httpCredentials: { username: previewUsername, password: previewPassword },
    });
    const page = await context.newPage();
  
    await page.goto('https://beta.badmintonengland.co.uk/allengland');
    await page.getByRole('button', { name: 'Accept All Cookies' }).click();
    await page
      .getByRole('banner')
      .filter({ hasText: 'THE ONE TO WIN | Tuesday 3rd' })
      .getByLabel('Burger Menu')
      .click();
  
    // Expected font styles
    const expected = {
      familyIncludes: 'neue-haas-grotesk-display',
      size: '30px',
      weight: ['600', '700'], // allow both since browsers normalize differently
    };
  
    // Helper to validate one tab
    async function validateFontForTab(tabName: string) {
      const locator = page.getByRole('tab', { name: tabName }).first();
      const actual = await locator.evaluate((el) => {
        const s = getComputedStyle(el);
        return {
          family: s.fontFamily,
          size: s.fontSize,
          weight: s.fontWeight,
        };
      });
  
      console.log(`Font validation for "${tabName}"`);
      console.log('Expected:', expected);
      console.log('Actual  :', actual);
  
      // Assertions
      expect(actual.family.toLowerCase()).toContain(expected.familyIncludes);
      expect(actual.size).toBe(expected.size);
      expect(expected.weight).toContain(actual.weight);
    }
  
    // Validate all required tabs
    await validateFontForTab('News');
    await validateFontForTab('Watch');
    await validateFontForTab('Tickets');
    await validateFontForTab('Volunteer');
    await validateFontForTab('Contact Us');
});

test('Yonex All England Options', async ({ browser }) => {
test.setTimeout(120000);
  
const context = await browser.newContext({httpCredentials: { username: previewUsername, password: previewPassword },});
const page = await context.newPage();
await page.goto('https://beta.badmintonengland.co.uk/allengland');
  
await page.getByRole('button', { name: 'Accept All Cookies' }).click();
await page.getByRole('banner').filter({ hasText: 'THE ONE TO WIN | Tuesday 3rd' }).getByLabel('Burger Menu').click();
  
// Scope to the section that contains the "YONEX All England" link
const aeSection = page.getByRole('navigation').filter({ has: page.getByRole('link', { name: 'YONEX All England', exact: true }) });
  
// The options we want are the tabs in the nested list under that section
const aeOptions = aeSection.getByRole('list').last().getByRole('tab');
  
// Optional debug
const found = await aeOptions.count();console.log(`YONEX All England menu items found: ${found}`);
  
// Assert exact labels (order + text) and that nothing else is present
const expectedOptions = [
    '2026 Event',
    'Tickets',
    'About',
    'Volunteer',
    'Media',
    'Contact Us',
    'Partners',
    'Watch',
];
      
await expect(aeOptions).toHaveText(expectedOptions);
await expect(aeOptions).toHaveCount(8);
});

test('Yonex Site Map Validation - 2026 Event Section', async ({ browser }) => {
  test.setTimeout(120000);

  const context = await browser.newContext({
    httpCredentials: { username: previewUsername, password: previewPassword },
  });

  const page = await context.newPage();
  await page.goto('https://beta.badmintonengland.co.uk/allengland');
  await page.getByRole('button', { name: 'Accept All Cookies' }).click();
  await page
    .getByRole('banner')
    .filter({ hasText: 'THE ONE TO WIN | Tuesday 3rd' })
    .getByLabel('Burger Menu')
    .click();

  // Target only the nested list that has "2026 Event" but not the "YONEX All England" header
  const eventList = page
    .getByRole('navigation')
    .getByRole('list')
    .filter({
      has: page.getByRole('tab', { name: '2026 Event', exact: true }),
      hasNot: page.getByRole('tab', { name: 'YONEX All England', exact: true }),
    })
    .first();

  const eventTabs = eventList.getByRole('tab');

  // Assert exact count and labels
  await expect(eventTabs).toHaveCount(8);
  await expect(eventTabs).toHaveText([
    '2026 Event',
    'Tickets',
    'About',
    'Volunteer',
    'Media',
    'Contact Us',
    'Partners',
    'Watch',
  ]);

  // Font validation
  const count = await eventTabs.count();
  for (let i = 0; i < count; i++) {
    const tab = eventTabs.nth(i);
    await expect(tab).toHaveCSS('font-family', /Agenda/i);
    await expect(tab).toHaveCSS('font-size', '16px');
  }
});  

test('Yonex Section Validation', async ({ browser }) => {
  test.setTimeout(120000);

  const context = await browser.newContext({
    httpCredentials: { username: previewUsername, password: previewPassword },
  });
  const page = await context.newPage();

  await page.goto('https://beta.badmintonengland.co.uk/allengland');
  await page.getByRole('button', { name: 'Accept All Cookies' }).click();
  await page
    .getByRole('banner')
    .filter({ hasText: 'THE ONE TO WIN | Tuesday 3rd' })
    .getByLabel('Burger Menu')
    .click();

  // Scope to the footer nav that contains the site map
  const footerNav = page
    .getByRole('navigation')
    .filter({ has: page.getByRole('link', { name: 'YONEX All England', exact: true }) });

  // Escape Tailwind special chars: .last\:pb-\[32px\]
  const ulsWithTailwindClass = footerNav.locator('ul.last\\:pb-\\[32px\\]');

  const count = await ulsWithTailwindClass.count();

  if (count !== 1) {
    console.error(
      ` Validation failed: Expected exactly 1 <ul class="last:pb-[32px]">, but found ${count}. ` +
      `This likely means more site map sections were added.`
    );
  }

  await expect(ulsWithTailwindClass).toHaveCount(1);
});
