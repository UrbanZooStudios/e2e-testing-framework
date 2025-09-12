// npx playwright test "test/Fanside/Fanside News Article.spec.ts"
import { test, expect } from '@playwright/test';  // <-- add expect
import * as dotenv from 'dotenv';
dotenv.config();

const ENVIRONMENTS = [
  {
    name: 'Live Preview',
    url: 'https://livepreview.safc.com/news/_/preview/fd00f330-19ce-11ef-81f7-5daf4602e6c6',
    httpAuth: true,
  },
  {
    name: 'Prod',
    url: 'https://www.safc.com/news/_/preview/fd00f330-19ce-11ef-81f7-5daf4602e6c6',
    httpAuth: false,
  },
];
import {
  PROD_BASE, PREVIEW_BASE, ARTICLE_PATH,
  previewUsername, previewPassword,
  acceptCookies,
  expectNewsHeroHrefPopulated,
  expectNewsListingHrefsPopulated,
  assertArticleLoads,
  validateCategoryTabs,
} from '../Utils/FansideNewsArticle.helpers';

/* ============ TESTS ============ */

test('Feature News Article', async ({ browser }) => {
  test.setTimeout(90_000);

  // PROD
  const prodContext = await browser.newContext();
  try {
    prodContext.setDefaultTimeout(60_000);
    const prodPage = await prodContext.newPage();
    prodPage.setDefaultNavigationTimeout(60_000);
    const resp = await prodPage.goto(`${PROD_BASE}/news`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    test.expect.soft(resp?.ok()).toBeTruthy();
    await acceptCookies(prodPage, 'PROD /news');
    await expectNewsHeroHrefPopulated(prodPage, 'PROD');
  } finally {
    await prodContext.close();
  }

  // PREVIEW
  const previewContext = await browser.newContext({ httpCredentials: { username: previewUsername, password: previewPassword } });
  try {
    previewContext.setDefaultTimeout(60_000);
    const previewPage = await previewContext.newPage();
    previewPage.setDefaultNavigationTimeout(60_000);
    const resp = await previewPage.goto(`${PREVIEW_BASE}/news`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    test.expect.soft(resp?.ok()).toBeTruthy();
    await previewPage.getByRole('button', { name: 'Accept All Cookies' }).click();    
    await expectNewsHeroHrefPopulated(previewPage, 'PREVIEW');
  } finally {
    await previewContext.close();
  }
});

test('News Page - News Listing', async ({ browser }) => {
  test.setTimeout(120_000);

  // PROD
  const prodContext = await browser.newContext();
  try {
    prodContext.setDefaultTimeout(60_000);
    const prodPage = await prodContext.newPage();
    prodPage.setDefaultNavigationTimeout(60_000);
    const resp = await prodPage.goto(`${PROD_BASE}/news`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    test.expect.soft(resp?.ok()).toBeTruthy();
    await acceptCookies(prodPage, 'PROD /news');
    await expectNewsListingHrefsPopulated(prodPage, 'PROD');
  } finally {
    await prodContext.close();
  }

  // PREVIEW
  const previewContext = await browser.newContext({ httpCredentials: { username: previewUsername, password: previewPassword } });
  try {
    previewContext.setDefaultTimeout(60_000);
    const previewPage = await previewContext.newPage();
    previewPage.setDefaultNavigationTimeout(60_000);
    const resp = await previewPage.goto(`${PREVIEW_BASE}/news`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    test.expect.soft(resp?.ok()).toBeTruthy();
    await acceptCookies(previewPage, 'PREVIEW /news');
    await expectNewsListingHrefsPopulated(previewPage, 'PREVIEW');
  } finally {
    await previewContext.close();
  }
});

test('News Page - News Story', async ({ browser }) => {
  test.setTimeout(120_000);

  // PROD
  const prodContext = await browser.newContext();
  try {
    const page = await prodContext.newPage();
    await page.goto(`${PROD_BASE}${ARTICLE_PATH}`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    await acceptCookies(page, 'PROD /article');
    await assertArticleLoads(page, PROD_BASE, 'PROD');
  } finally {
    await prodContext.close();
  }

  // PREVIEW
  const previewContext = await browser.newContext({ httpCredentials: { username: previewUsername, password: previewPassword } });
  try {
    const page = await previewContext.newPage();
    await page.goto(`${PREVIEW_BASE}${ARTICLE_PATH}`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    await acceptCookies(page, 'PREVIEW /article');
    await assertArticleLoads(page, PREVIEW_BASE, 'PREVIEW');
  } finally {
    await previewContext.close();
  }
});

test('News Page - News Category Tabs', async ({ browser }) => {
  // --- PREVIEW ---
  const previewCtx = await browser.newContext({
    httpCredentials: { username: previewUsername, password: previewPassword },});
  const previewPage = await previewCtx.newPage();
  const previewSeq = await validateCategoryTabs(previewPage, PREVIEW_BASE, 'PREVIEW').finally(() => previewCtx.close());

  // --- PROD ---
  const prodCtx = await browser.newContext();
  const prodPage = await prodCtx.newPage();
  const prodSeq = await validateCategoryTabs(prodPage, PROD_BASE, 'PROD').finally(() => prodCtx.close());

// Compare sequences (sanity only, not strict equality)
const n = Math.min(previewSeq.length, prodSeq.length);
const pv = previewSeq.slice(0, n);
const pr = prodSeq.slice(0, n);

// Ensure both environments surface tabs
expect(pv.length, '[PREVIEW] should expose at least one category tab').toBeGreaterThan(0);
expect(pr.length,   '[PROD] should expose at least one category tab').toBeGreaterThan(0);

// Ensure labels are “visible” in the sense of non-empty text
for (const [i, t] of pv.entries()) {
  expect((t ?? '').trim().length, `[PREVIEW] tab ${i} should have text`).toBeGreaterThan(0);
}
for (const [i, t] of pr.entries()) {
  expect((t ?? '').trim().length, `[PROD] tab ${i} should have text`).toBeGreaterThan(0);
}
});

test('News Page - Load More News', async ({ browser }) => {
  test.setTimeout(120_000);

  const context = await browser.newContext({
    httpCredentials: { username: previewUsername, password: previewPassword },
  });
  const page = await context.newPage();

  await page.goto('https://livepreview.tranmererovers.co.uk/', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Accept All Cookies' }).click();
  await page.getByRole('link', { name: 'News', exact: true }).click();

  // Scope to the news listing container
  const listing = page.locator('div.news-listing'); // <div class="pb-8 bg-surface news-listing">
  await expect(listing).toBeVisible();

  // Wait for the grid that holds the cards to be present/visible
  const grid = listing.locator('div.container.grid');
  await expect(grid).toBeVisible();

  // Links to individual news cards (adjust if your site changes classnames)
  const items = grid.locator('a.group.news-article, a[href^="/news/"]');

  // Ensure at least one card is rendered before counting
  await expect(items.first()).toBeVisible();
  const before = await items.count();
  expect(before, 'Expected at least one news card before clicking Load more').toBeGreaterThan(10);

  // Click "Load more news" (some builds use <a>, others <button>)
  const loadMoreLink = page.getByRole('link', { name: /load more news/i });
  const loadMoreBtn  = page.getByRole('button', { name: /load more news/i });
  const loadMore = (await loadMoreLink.isVisible()) ? loadMoreLink : loadMoreBtn;

  await page.locator('a').filter({ hasText: 'Load more news' }).click();

  let after = before; // will be updated during polling
  await expect
    .poll(async () => {
      after = await items.count(); // capture the latest value each poll
      return after;
    }, { timeout: 15_000 })
    .toBeGreaterThan(before);
  
  // Log counts + Difference
  console.log(`[Load more] items before=${before}, after=${after}, Diff=${after - before}`);
});

test('News Page - Sponsor Sections - Prem', async ({ browser }) => {
  const urls = {
    prod: 'https://www.avfc.co.uk/',
    preview: 'https://livepreview.avfc.co.uk/',
  };

  async function getListItemCount(url: string, needsAuth: boolean = false) {
    // Context with/without auth
    const context = await browser.newContext(
      needsAuth
        ? {
            httpCredentials: {
              username: process.env.PREVIEW_USERNAME || 'urbanzoo',
              password: process.env.PREVIEW_PASSWORD || 'gamechanger1!',
            },
          }
        : {}
    );

    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Handle cookie banner if present
    const cookieButton = page.getByRole('button', { name: 'Accept All Cookies' });
    if (await cookieButton.isVisible()) {
      await cookieButton.click();
      console.log(`Cookie banner accepted on ${url}`);
    } else {
      console.log(`No cookie banner found on ${url}`);
    }

    // Count <li> items
    const listItems = page.locator('li');
    const count = await listItems.count();
    console.log(`Total <li> elements on ${url}: ${count}`);

    await context.close();
    return count;
  }

  // Get counts
  const prodCount = await getListItemCount(urls.prod);
  const previewCount = await getListItemCount(urls.preview, true);

  // Compare counts
  expect(prodCount, 'Expected PROD <li> count to be > 1').toBeGreaterThan(1);
  expect(previewCount, 'Expected Preview <li> count to be > 1').toBeGreaterThan(1);
  console.log(`Comparison: PROD (${prodCount}) vs Preview (${previewCount})`);
  expect(prodCount).toBe(previewCount);
});

test('News Page - Sponsor Sections - EFL', async ({ browser }) => {
  const urls = {
    prod: 'https://www.rovers.co.uk/',
    preview: 'https://livepreview.rovers.co.uk/',
  };

  async function getListItemCount(url: string, needsAuth: boolean = false) {
    // Context with/without auth
    const context = await browser.newContext(
      needsAuth
        ? {
            httpCredentials: {
              username: process.env.PREVIEW_USERNAME || 'urbanzoo',
              password: process.env.PREVIEW_PASSWORD || 'gamechanger1!',
            },
          }
        : {}
    );

    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Handle cookie banner if present
    const cookieButton = page.getByRole('button', { name: 'Accept All Cookies' });
    if (await cookieButton.isVisible()) {
      await cookieButton.click();
      console.log(`Cookie banner accepted on ${url}`);
    } else {
      console.log(`No cookie banner found on ${url}`);
    }
    const promoClose = page.locator('.overlay-promo__close-button');
    if (await promoClose.isVisible()) {
      await promoClose.click();
      console.log(`Promo overlay closed`);
    } else {
      console.log(`No promo overlay found`);
    }

    // Count Sponsor Items items
    const listItems = page.locator('li');
    const count = await listItems.count();
    console.log(`Total <li> elements on ${url}: ${count}`);

    await context.close();
    return count;
  }

  // Get LivePreview count & Prod counts
  const prodCount = await getListItemCount(urls.prod);
  const previewCount = await getListItemCount(urls.preview, true);

  // Compare counts
  expect(prodCount, 'Expected PROD <li> count to be > 1').toBeGreaterThan(1);
  expect(previewCount, 'Expected Preview <li> count to be > 1').toBeGreaterThan(1);
  console.log(`Comparison: PROD (${prodCount}) vs Preview (${previewCount})`);
  expect(prodCount).toBe(previewCount);
});

test('News Story - Share Icons (Preview & Prod)', async ({ browser }) => {
  test.setTimeout(120000); // 2 minutes

  for (const env of ENVIRONMENTS) {
    await test.step(`Validate share icons on ${env.name}`, async () => {
      // Context with HTTP credentials only for Live Preview
      const context = await browser.newContext(
        env.httpAuth
          ? {
              httpCredentials: {
                username: previewUsername,
                password: previewPassword,
              },
            }
          : {}
      );
      const page = await context.newPage();

      // 1) Navigate
      await page.goto(env.url, { waitUntil: 'networkidle' });

      // 2) Accept all cookies (if banner appears)
      const cookieButton = page.getByRole('button', { name: /Accept All Cookies/i });
      if (await cookieButton.isVisible().catch(() => false)) {
        await cookieButton.click();
      }

      // 3) Close promo if present
      const promo = page.locator('.absolute.-top-\\[25px\\]');
      if (await promo.isVisible().catch(() => false)) {
        await promo.click();
      } else {
        console.log(`[${env.name}] Promo not visible, moving to next step...`);
      }

      // 4) Validate "Share" section exists
      await expect(page.locator('#page div').filter({ hasText: 'Share' }).nth(4)).toBeVisible();
      await expect(page.getByRole('main')).toContainText('Share');

      // 5) Validate share links snapshot
      const encodedUrl = encodeURIComponent(env.url);
      await expect(page.getByRole('main')).toMatchAriaSnapshot(`
        - paragraph: Share
        - link:
          - /url: https://facebook.com/sharer.php?display=popup&u=${encodedUrl}
          - tab:
            - img
        - link:
          - /url: https://twitter.com/intent/tweet?text=undefined&url=${encodedUrl}
          - tab:
            - img
        - link:
          - /url: mailto:?body=%0D%0A%0D%0A%0D%0Aundefined%20%20-%20%20UZ Test News Article LEAVE IN DRAFT%0D%0A%0D%0A${encodedUrl}
          - tab:
            - img
        - tab:
          - img
      `);

      // 6) Direct link checks (extra robustness)
// 6) Direct link checks (extra robustness)
const fbLink = `https://facebook.com/sharer.php?display=popup&u=${encodedUrl}`;
const twLink = `https://twitter.com/intent/tweet?text=undefined&url=${encodedUrl}`;
const mailLink = `mailto:?body=%0D%0A%0D%0A%0D%0Aundefined%20%20-%20%20UZ Test News Article LEAVE IN DRAFT%0D%0A%0D%0A${encodedUrl}`;

await expect(page.locator(`a[href="${fbLink}"]`)).toBeVisible();
console.log(`[${env.name}] ✅ Found Facebook share link: ${fbLink}`);

await expect(page.locator(`a[href="${twLink}"]`)).toBeVisible();
console.log(`[${env.name}] ✅ Found Twitter share link: ${twLink}`);

await expect(page.locator(`a[href="${mailLink}"]`)).toBeVisible();
console.log(`[${env.name}] ✅ Found Mailto share link: ${mailLink}`);
      await context.close();
    });
  }
});
