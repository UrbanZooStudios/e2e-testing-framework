import { test, expect, chromium, Page, BrowserContext, Route } from '@playwright/test';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import dotenv from 'dotenv';
import fs from 'fs';

import { sitesToTest } from './config/sitesToTest';

dotenv.config();

async function acceptCookiesIfPresent(page: Page, customSelector?: string) {
  const fallbackSelectors = [
    '#onetrust-accept-btn-handler',
    'button:has-text("Accept All Cookies")',
    'button:has-text("Accept Cookies")',
    'button:has-text("Got it")',
    '[aria-label="accept cookies"]',
    '.cookie-banner-accept',
  ];

  const selectorsToTry = customSelector ? [customSelector, ...fallbackSelectors] : fallbackSelectors;

  for (const selector of selectorsToTry) {
    try {
      const locator = page.locator(selector);
      if (await locator.isVisible({ timeout: 2000 })) {
        await locator.click({ timeout: 2000 });
        await page.waitForTimeout(1000);
        break;
      }
    } catch {
      // Ignore errors and try next
    }
  }
}

// Function to hide dynamic ad elements
async function hideDynamicAds(page: Page) {
  await page.addStyleTag({
    content: `
      [id^="adlnk_"],
      [id^="adCont_"],
      iframe[src*="adition.com"],
      iframe[src*="doubleclick.net"],
      iframe[src*="googlesyndication.com"],
      img[alt="Click here"],
      img[alt*="advert"],
      img[src*="adition.com"],
      img[src*="doubleclick.net"],
      img[src*="googlesyndication.com"],
      div[class*="ad"],
      div[id*="ad"],
      .adslot,
      .adsbygoogle,
      .sponsor,
      .sponsored,
      [data-testid*="ad"] {
        display: none !important;
        visibility: hidden !important;
      }
    `,
  });

  await page.evaluate(() => {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (
            node instanceof HTMLElement &&
            (
              node.innerHTML.includes('ad') ||
              node.id.includes('ad') ||
              node.className.includes('ad') ||
              node.innerHTML.includes('adition.com') ||
              node.innerHTML.includes('doubleclick.net')
            )
          ) {
            node.style.display = 'none';
            node.style.visibility = 'hidden';
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
}

// Typing added to context and route
function blockAdRequests(context: BrowserContext) {
  context.route('**/*', (route: Route) => {
    const url = route.request().url();
    if (
      url.includes('adition.com') ||
      url.includes('doubleclick.net') ||
      url.includes('googlesyndication.com')
    ) {
      return route.abort();
    }
    return route.continue();
  });
}

test.describe('Visual regression for all club sites', () => {
  for (const site of sitesToTest) {
    test.describe(site.name, () => {
      test('Visual regression check', async () => {
        test.setTimeout(120000); // 2 minutes

        const screenshotsDir = 'screenshots';
        if (!fs.existsSync(screenshotsDir)) {
          fs.mkdirSync(screenshotsDir);
        }

        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const dateString = `${day}-${month}`;

        const files = fs.readdirSync(screenshotsDir);
        for (const file of files) {
          if (file.endsWith('.png') && !file.includes(dateString)) {
            fs.unlinkSync(`${screenshotsDir}/${file}`);
          }
        }

        const browser = await chromium.launch();

        // === PREVIEW (Authenticated) ===
        const contextPreview = await browser.newContext({
          httpCredentials: {
            username: process.env.PREVIEW_USERNAME || 'urbanzoo',
            password: process.env.PREVIEW_PASSWORD || 'gamechanger1!',
          },
        });

        blockAdRequests(contextPreview);
        const pagePreview = await contextPreview.newPage();
        await pagePreview.goto(site.previewUrl, { timeout: 45000, waitUntil: 'load' });
        await acceptCookiesIfPresent(pagePreview, site.cookieSelector);
        await pagePreview.waitForTimeout(2000);
        await hideDynamicAds(pagePreview);
        await pagePreview.waitForTimeout(3000);
        await hideDynamicAds(pagePreview);

        await pagePreview.screenshot({
          path: `${screenshotsDir}/${site.name}_preview_${dateString}.png`,
          fullPage: true,
        });

        // === LIVE (Unauthenticated) ===
        const contextLive = await browser.newContext();
        blockAdRequests(contextLive);
        const pageLive = await contextLive.newPage();
        await pageLive.goto(site.liveUrl, { timeout: 45000, waitUntil: 'load' });
        await acceptCookiesIfPresent(pageLive, site.cookieSelector);
        await pageLive.waitForTimeout(3000);
        await hideDynamicAds(pageLive);
        await pageLive.waitForTimeout(3000);
        await hideDynamicAds(pageLive);

        await pageLive.screenshot({
          path: `${screenshotsDir}/${site.name}_live_${dateString}.png`,
          fullPage: true,
        });

        // === DIFF ===
        const img1 = PNG.sync.read(fs.readFileSync(`${screenshotsDir}/${site.name}_preview_${dateString}.png`));
        const img2 = PNG.sync.read(fs.readFileSync(`${screenshotsDir}/${site.name}_live_${dateString}.png`));
        const { width, height } = img1;
        const diff = new PNG({ width, height });

        const pixelDiff = pixelmatch(img1.data, img2.data, diff.data, width, height, {
          threshold: 0.1,
        });

        fs.writeFileSync(`${screenshotsDir}/${site.name}_diff_${dateString}.png`, PNG.sync.write(diff));
        await browser.close();

        expect(pixelDiff).toBeLessThan(100);
      });
    });
  }
});
