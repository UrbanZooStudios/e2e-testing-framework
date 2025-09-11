// npx playwright test "test/Fanside/Fanside News Article.spec.ts"
import { test, expect } from '@playwright/test';  // <-- add expect
import * as dotenv from 'dotenv';
dotenv.config();

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

test('Feature News Article — hero/news href is populated on PROD and PREVIEW /news', async ({ browser }) => {
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
}});

