// npx playwright test "test/Visual Regression/Everton FC.spec.ts"
import { test, expect, chromium, Browser, Page } from '@playwright/test';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

async function acceptCookiesIfPresent(page: Page, customSelector?: string) {
  const fallbackSelectors = [
    customSelector,
    '#onetrust-accept-btn-handler',
    'button:has-text("Accept All Cookies")',
    'button:has-text("Accept Cookies")',
    'button:has-text("Got it")',
    '[aria-label="accept cookies"]',
    '.cookie-banner-accept',
  ].filter(Boolean);

  for (const selector of fallbackSelectors) {
    try {
      const locator = page.locator(selector!);
      if (await locator.isVisible({ timeout: 2000 })) {
        await locator.click({ timeout: 2000 });
        await page.waitForTimeout(1000);
        break;
      }
    } catch {}
  }
}

function normalizeImageSizes(imgA: PNG, imgB: PNG): [PNG, PNG] {
  const width = Math.max(imgA.width, imgB.width);
  const height = Math.max(imgA.height, imgB.height);

  const createPadded = (img: PNG) => {
    const padded = new PNG({ width, height });
    PNG.bitblt(img, padded, 0, 0, img.width, img.height, 0, 0);
    return padded;
  };

  return [createPadded(imgA), createPadded(imgB)];
}

async function runSingleVisualTest(
  browser: Browser,
  label: string,
  previewUrl: string,
  liveUrl: string,
  siteName: string
) {
  const dateString = new Date().toISOString().split('T')[0];
  const screenshotsDir = `screenshots/${siteName.toLowerCase().replace(/\s+/g, '-')}`;
  const subdirs = ['previews', 'lives', 'diffs'];
  subdirs.forEach(sub => fs.mkdirSync(`${screenshotsDir}/${sub}`, { recursive: true }));

  const previewPage = await browser.newContext({
    httpCredentials: {
      username: process.env.PREVIEW_USERNAME || 'urbanzoo',
      password: process.env.PREVIEW_PASSWORD || 'gamechanger1!',
    },
  }).then(c => c.newPage());

  await previewPage.setViewportSize({ width: 1280, height: 800 });
  await previewPage.goto(previewUrl, { timeout: 60000, waitUntil: 'load' });
  await acceptCookiesIfPresent(previewPage, '#onetrust-accept-btn-handler');
  await previewPage.waitForSelector('main, .main-content, body', { timeout: 10000 });

  await previewPage.waitForTimeout(1000);
  await previewPage.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
  await previewPage.waitForTimeout(2000);
  await previewPage.waitForTimeout(10000); // ✅ Wait 10 seconds before preview screenshot

  const previewPath = `${screenshotsDir}/previews/${label}_${dateString}.png`;
  await previewPage.screenshot({ path: previewPath, fullPage: true });

  const livePage = await browser.newPage();
  await livePage.setViewportSize({ width: 1280, height: 800 });
  await livePage.goto(liveUrl, { timeout: 60000, waitUntil: 'load' });
  await acceptCookiesIfPresent(livePage, '#onetrust-accept-btn-handler');
  await livePage.waitForSelector('main, .main-content, body', { timeout: 10000 });

  await livePage.waitForTimeout(1000);
  await livePage.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
  await livePage.waitForTimeout(2000);
  await livePage.waitForTimeout(10000); // ✅ Wait 10 seconds before live screenshot

  const livePath = `${screenshotsDir}/lives/${label}_${dateString}.png`;
  await livePage.screenshot({ path: livePath, fullPage: true });

  const img1 = PNG.sync.read(fs.readFileSync(previewPath));
  const img2 = PNG.sync.read(fs.readFileSync(livePath));
  const [img1Normalized, img2Normalized] = normalizeImageSizes(img1, img2);
  const diff = new PNG({ width: img1Normalized.width, height: img1Normalized.height });

  const pixelDiff = pixelmatch(
    img1Normalized.data,
    img2Normalized.data,
    diff.data,
    img1Normalized.width,
    img1Normalized.height,
    { threshold: 0.1 }
  );

  const diffPath = `${screenshotsDir}/diffs/${label}_${dateString}.png`;
  fs.writeFileSync(diffPath, PNG.sync.write(diff));

  console.log(`✅ ${label} | Pixel diff: ${pixelDiff}`);
}

test.describe('Visual Regression Per Page', () => {
  const site = {
    name: 'Wigan Athletic',
    preview: "https://preview.wiganathletic.com",
    live: "https://wiganathletic.com",
  };
  const pages = [
    { label: 'home', path: '/' },
    { label: 'news', path: '/news' },
    { label: 'matches', path: '/matches' },
    { label: 'teams', path: '/teams' },
    { label: 'tickets', path: '/tickets' },
  ];

  for (const { label, path } of pages) {
    test(`Compare ${label} page`, async () => {
      test.setTimeout(60000); // 1 minute per test

      const browser = await chromium.launch();
      await runSingleVisualTest(browser, label, `${site.preview}${path}`, `${site.live}${path}`, site.name);
      await browser.close();
    });
  }
});
