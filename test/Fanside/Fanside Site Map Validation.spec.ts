// npx playwright test "test/Fanside/Fanside Site Map Validation.spec.ts" --headed

import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();
const previewUsername = process.env.PREVIEW_USERNAME || 'urbanzoo';
const previewPassword = process.env.PREVIEW_PASSWORD || 'gamechanger1!';


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

test('Everton FC Site Map Validation', async ({ browser }) => {
  const context = await browser.newContext({
    httpCredentials: {
      username: process.env.PREVIEW_USERNAME || 'urbanzoo',
      password: process.env.PREVIEW_PASSWORD || 'gamechanger1!',
    },
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  await page.goto('https://livepreview.evertonfc.com', { waitUntil: 'domcontentloaded' });

  // Accept cookies if present (scoped)
  await page.getByRole('dialog', { name: /privacy/i })
    .getByRole('button', { name: /^accept all cookies$/i })
    .click()
    .catch(() => {});

  await page.getByLabel('Burger Menu').click();

  // Validate banner (optional, trimmed to what actually exists there)
  await expect(page.getByRole('banner')).toMatchAriaSnapshot(`
    - banner:
      - link "Everton FC Logo":
        - /url: /
        - img "Everton FC Logo"
      - navigation:
        - tab "CLUB SITE":
          - paragraph: CLUB SITE
        - tab "Tickets":
          - paragraph: Tickets
        - tab "Premium":
          - paragraph: Premium
        - tab "Stadium":
          - paragraph: Stadium
        - tab "EITC":
          - paragraph: EITC
        - tab "Store":
          - paragraph: Store
      - button "Log In":
        - tab:
          - img
        - text: Log in
      - tab:
        - img
      - tab:
        - img
  `);

  // Mega-nav lives under #page
  const megaNavRoot = page.locator('#page');
  await expect(megaNavRoot).toBeVisible();

  // Structure snapshot for mega-nav (will fail on extras/missing/reordered)
  await expect(megaNavRoot).toMatchAriaSnapshot(`
    - list:
      - tab "Club":
        - link "Club":
          - /url: /club
      - list:
        - listitem:
          - tab "All Together Now"
        - listitem:
          - tab "Contact Us"
        - listitem:
          - tab "Partners"
        - listitem:
          - tab "Academy"
        - listitem:
          - tab "Careers"
        - listitem:
          - tab "History"
        - listitem:
          - tab "Shareholders"
        - listitem:
          - tab "Safeguarding"
        - listitem:
          - tab "Everton For Change"
    - list:
      - tab "Fans":
        - link "Fans":
          - /url: /fans
      - list:
        - listitem:
          - tab "Matchday"
        - listitem:
          - tab "Travel Hub"
        - listitem:
          - tab "App"
        - listitem:
          - tab "Latest Fan News"
        - listitem:
          - tab "Fans' Charter"
        - listitem:
          - tab "FAQs"
        - listitem:
          - tab "Everton Fan Wall"
        - listitem:
          - tab "Matchday Programme"
        - listitem:
          - tab "EDSA"
        - listitem:
          - tab "Disabled Supporters"
        - listitem:
          - tab "Supporters' Clubs"
        - listitem:
          - tab "Fan Advisory Board"
        - listitem:
          - tab "Fans' Forum"
        - listitem:
          - tab "Junior Fans' Forum"
        - listitem:
          - tab "Fan Engagement Plan"
    - list:
      - tab "Tickets":
        - link "Tickets":
          - /url: /tickets
      - list:
        - listitem:
          - tab "Ticket & Hotel Breaks"
        - listitem:
          - tab "Pricing"
        - listitem:
          - tab "Forever Blue"
        - listitem:
          - tab "Buy Premium"
        - listitem:
          - tab "Buy Tickets"
        - listitem:
          - tab "Ticket Availability"
        - listitem:
          - tab "Latest Ticket News"
        - listitem:
          - tab "Ticket On Sale Dates"
        - listitem:
          - tab "Travel Hub"
        - listitem:
          - tab "Stadium Tours"
        - listitem:
          - tab "Box Office Hours"
        - listitem:
          - tab "Ticket Information"
        - listitem:
          - tab "Your Everton Network"
    - list:
      - tab "Matches":
        - link "Matches":
          - /url: /matches
      - list:
        - listitem:
          - tab "Standings"
    - list:
      - tab "Players":
        - link "Players":
          - /url: /players
      - list:
        - listitem:
          - tab "Men's Senior Team Staff"
        - listitem:
          - tab "Injuries & Suspensions"
        - listitem:
          - tab "Transfers"
    - list:
      - tab "Forever Blue":
        - link "Forever Blue":
          - /url: /foreverblue
      - list:
        - listitem:
          - tab "Memberships"
        - listitem:
          - tab "Rewards"
    - list:
      - tab "evertontv+":
        - link "evertontv+":
          - /url: /evertontvplus
      - list
    - list:
      - tab "Women":
        - link "Women":
          - /url: /women
      - list:
        - listitem:
          - tab "History & Honours"
        - listitem:
          - tab "Hospitality"
        - listitem:
          - tab "First-Team Management Staff"
        - listitem:
          - tab "Season Tickets"
    - list:
      - tab "International Academy":
        - link "International Academy":
          - /url: /international
      - list:
        - listitem:
          - tab "Latest News"
        - listitem:
          - tab "Affiliate Programme"
        - listitem:
          - tab "Soccer Schools"
  `);

  // ---- Flat list + clean diff (from mega-nav only) ----
  // Keep utility items out only if they appear *before* the main nav starts
  const UTILITY = new Set(['club site','tickets','premium','stadium','eitc','store']); // case-insensitive
  const normalize = (s: string) => s.replace(/\s+/g, ' ').trim();

  // Collect and normalize
  let actualRaw: string[] =
    (await megaNavRoot.getByRole('tab').allInnerTexts())
      .map(normalize)
      .filter(Boolean);

  // Determine where the main nav begins (first occurrence of a main item)
  const MAIN_STARTERS = new Set(['news','matches','teams','fans','videos','club']);
  const firstMainIdx = actualRaw.findIndex(t => MAIN_STARTERS.has(t.toLowerCase()));

  // Filter out only the leading utility tabs (before the main nav starts)
  const actualFiltered =
    actualRaw.filter((t, idx) => !(idx < firstMainIdx && UTILITY.has(t.toLowerCase())));

  const expected: string[] = [
    'News','Matches','Teams','Fans','Videos','Club',
    'All Together Now','Contact Us','Partners','Academy','Careers','History','Shareholders',
    'Safeguarding','Everton For Change',
    'Fans','Matchday','Travel Hub','App','Latest Fan News',"Fans' Charter",'FAQs','Everton Fan Wall',
    'Matchday Programme','EDSA','Disabled Supporters',"Supporters' Clubs",'Fan Advisory Board',
    "Fans' Forum","Junior Fans' Forum",'Fan Engagement Plan',
    'Tickets','Ticket & Hotel Breaks','Pricing','Forever Blue','Buy Premium','Buy Tickets',
    'Ticket Availability','Latest Ticket News','Ticket On Sale Dates','Travel Hub','Stadium Tours',
    'Box Office Hours','Ticket Information','Your Everton Network',
    'Matches','Standings',
    'Players',"Men's Senior Team Staff",'Injuries & Suspensions','Transfers',
    'Forever Blue','Memberships','Rewards','evertontv+',
    'Women','History & Honours','Hospitality','First-Team Management Staff','Season Tickets',
    'International Academy','Latest News','Affiliate Programme','Soccer Schools',
  ];

  // Case-insensitive comparison (lowercase)
  const lower = (arr: string[]) => arr.map(s => s.toLowerCase());
  const actualLower = lower(actualFiltered);
  const expectedLower = lower(expected);

  // Diff (case-insensitive)
  const expectedSetLower = new Set(expectedLower);
  const actualSetLower = new Set(actualLower);
  const extras = actualFiltered.filter(i => !expectedSetLower.has(i.toLowerCase()));
  const missing = expected.filter(i => !actualSetLower.has(i.toLowerCase()));

  if (extras.length || missing.length) {
    console.error('❌ Menu validation failed (case-insensitive):');
    if (extras.length) console.error('  Unexpected:', extras.join(', '));
    if (missing.length) console.error('  Missing:', missing.join(', '));
  }

  // ✅ Enforce exact order & count, case-insensitive
  expect(actualLower, [
    'Menu items changed (case-insensitive).',
    `Found (${actualFiltered.length}): ${actualFiltered.join(' | ')}`,
    `Expected (${expected.length}): ${expected.join(' | ')}`,
  ].join('\n')).toEqual(expectedLower);
});
