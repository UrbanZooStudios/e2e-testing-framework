// npx playwright test "test/Fanside/Fanside Badminton England.spec.ts" --headed

import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

const email = process.env.PLAYWRIGHT_EMAIL;
const password = process.env.PLAYWRIGHT_PASSWORD;
const previewUsername = process.env.PREVIEW_USERNAME || 'urbanzoo';
const previewPassword = process.env.PREVIEW_PASSWORD || 'gamechanger1!';

if (!email || !password) {
  throw new Error("PLAYWRIGHT_EMAIL or PLAYWRIGHT_PASSWORD is not set.");
}

test('Badminton England Site Map Validation', async ({ browser }) => {
    test.setTimeout(120000);
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
    await page.goto('https://beta.badmintonengland.co.uk/');
    await page.getByRole('button', { name: 'Accept All Cookies' }).click();
    await page.getByRole('banner').filter({ hasText: '#ASportForEveryoneGB' }).getByLabel('Burger Menu').getByRole('img').click();
  
// Expected sitemap options (in order)
const expectedTabs = [
    'Get Involved',
    'News',
    'Courtside TV',
    'National Badminton Centre',
    'Careers',
    'Contact Us',
    'YONEX All England',
  ];
  
  // Footer sitemap: pick the list that has "Get Involved" but not the "About Us" section
  const topSitemapList = page
    .getByRole('navigation')
    .getByRole('list')
    .filter({
      has: page.getByRole('tab', { name: 'Get Involved', exact: true }),
      hasNot: page.getByRole('tab', { name: 'About Us', exact: true }),
    })
    .first();
  
const tabs = topSitemapList.getByRole('tab');
  
  // Assert exact count and labels (order)
await expect(tabs).toHaveCount(expectedTabs.length);
await expect(tabs).toHaveText(expectedTabs);
  
  // Optional debug if mismatch occurs
  const found = await tabs.allInnerTexts();if (found.join('|') !== expectedTabs.join('|')) {console.error(`Sitemap mismatch.\nExpected: ${expectedTabs.join(', ')}\nFound: ${found.join(', ')}`);}
});

test('Badminton England Site Map Menu Font Validation', async ({ browser }) => {
    test.setTimeout(120000);
  
    const context = await browser.newContext({
      httpCredentials: { username: previewUsername, password: previewPassword },
    });
    const page = await context.newPage();
  
    await page.goto('https://beta.badmintonengland.co.uk/');
    await page.getByRole('button', { name: 'Accept All Cookies' }).click();
    await page.getByRole('banner').filter({ hasText: '#ASportForEveryoneGB' }).getByLabel('Burger Menu').getByRole('img').click();
  
    // Scope to the expanded menu (this nav contains "National Badminton Centre", which
    // does NOT exist in the header nav, so it's a good anchor to avoid ambiguity)
    const menuNav = page
      .getByRole('navigation')
      .filter({ has: page.getByRole('tab', { name: 'National Badminton Centre', exact: true }) })
      .first();
  
    const expected = {
      familyPattern: /(?:roca|neue-haas)/i, // expected brand fonts in expanded menu
      size: '30px',
      weight: ['600', '700'],
    };
  
    async function validateFontForTab(tabName: string) {
      const tab = menuNav.getByRole('tab', { name: tabName, exact: true });
      await expect(tab).toHaveCSS('font-family', expected.familyPattern);
      await expect(tab).toHaveCSS('font-size', expected.size);
  
      const weight = await tab.evaluate(el => getComputedStyle(el).fontWeight);
      expect(expected.weight).toContain(weight);
    }
  
    await validateFontForTab('Get Involved');
    await validateFontForTab('News');
    await validateFontForTab('Courtside TV');
    await validateFontForTab('National Badminton Centre');
    await validateFontForTab('Careers');
    await validateFontForTab('Contact Us');
    await validateFontForTab('YONEX All England');
});
