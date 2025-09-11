// npx playwright test "test/Fanside/Fanside News Article.spec.ts"
import { test } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

import {
  PROD_BASE, PREVIEW_BASE, ARTICLE_PATH,
  previewUsername, previewPassword,
  acceptCookies,
  expectNewsHeroHrefPopulated,
  expectNewsListingHrefsPopulated,
  assertArticleLoads,
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
    await acceptCookies(previewPage, 'PREVIEW /news');
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
