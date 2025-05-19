import { test, expect, chromium, Browser, Page, BrowserContext, Route } from '@playwright/test';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { sitesToTest } from './config/sitesToTest';

dotenv.config();

type VisualTestResult = {
  site: string;
  label: string;
  diff: number;
  status: string;
};

const results: VisualTestResult[] = [];

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

async function runVisualTest(
  browser: Browser,
  label: string,
  previewUrl: string,
  liveUrl: string,
  screenshotsDir: string,
  dateString: string,
  siteName: string,
  cookieSelector?: string
) {
  console.log(`Running visual test: ${siteName} - ${label}`);

  const contextPreview = await browser.newContext({
    httpCredentials: {
      username: process.env.PREVIEW_USERNAME || 'urbanzoo',
      password: process.env.PREVIEW_PASSWORD || 'gamechanger1!',
    },
  });
  blockAdRequests(contextPreview);
  const pagePreview = await contextPreview.newPage();
  await pagePreview.setViewportSize({ width: 1280, height: 800 });
  await pagePreview.goto(previewUrl, { timeout: 45000, waitUntil: 'load' });
  await acceptCookiesIfPresent(pagePreview, cookieSelector);
  await pagePreview.waitForTimeout(3000);
  await hideDynamicAds(pagePreview);

  const previewPath = `${screenshotsDir}/previews/${siteName}_preview_${label}_${dateString}.png`;
  await pagePreview.screenshot({ path: previewPath, fullPage: true });
  console.log(`✅ Saved preview screenshot: ${previewPath}`);

  const contextLive = await browser.newContext();
  blockAdRequests(contextLive);
  const pageLive = await contextLive.newPage();
  await pageLive.setViewportSize({ width: 1280, height: 800 });
  await pageLive.goto(liveUrl, { timeout: 45000, waitUntil: 'load' });
  await acceptCookiesIfPresent(pageLive, cookieSelector);
  await pageLive.waitForTimeout(3000);
  await hideDynamicAds(pageLive);

  const livePath = `${screenshotsDir}/lives/${siteName}_live_${label}_${dateString}.png`;
  await pageLive.screenshot({ path: livePath, fullPage: true });
  console.log(`✅ Saved live screenshot: ${livePath}`);

  const img1 = PNG.sync.read(fs.readFileSync(previewPath));
  const img2 = PNG.sync.read(fs.readFileSync(livePath));

  let pixelDiff = 0;
  let status = 'PASS';

  try {
    if (img1.width !== img2.width || img1.height !== img2.height) {
      throw new Error('Image sizes do not match');
    }

    const width = img1.width;
    const height = img1.height;
    const diff = new PNG({ width, height });

    pixelDiff = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });

    const diffPath = `${screenshotsDir}/diffs/${siteName}_diff_${label}_${dateString}.png`;
    fs.writeFileSync(diffPath, PNG.sync.write(diff));
    console.log(`✅ Saved diff image: ${diffPath} (Pixel difference: ${pixelDiff})`);

    if (pixelDiff >= 100) {
      status = 'FAIL';
      throw new Error(`Pixel difference: ${pixelDiff}`);
    }
  } catch (err) {
    status = 'FAIL';
    pixelDiff = -1; // Indicate comparison failed
    console.error(`⚠️ Visual comparison failed for ${siteName} - ${label}: ${(err as Error).message}`);
  }

  results.push({
    site: siteName,
    label,
    diff: pixelDiff,
    status,
  });
}

function generateHtmlReport(results: VisualTestResult[], dateString: string, outputDir: string) {
  const rows = results.map(r => {
    const previewImg = `../previews/${r.site}_preview_${r.label}_${dateString}.png`;
    const liveImg = `../lives/${r.site}_live_${r.label}_${dateString}.png`;
    const diffImg = `../diffs/${r.site}_diff_${r.label}_${dateString}.png`;
    return `
      <tr>
        <td>${r.site}</td>
        <td>${r.label}</td>
        <td><img src="${previewImg}" width="300"/></td>
        <td><img src="${liveImg}" width="300"/></td>
        <td><img src="${diffImg}" width="300"/></td>
        <td>${r.diff >= 0 ? r.diff : 'ERROR'}</td>
        <td style="color: ${r.status === 'PASS' ? 'green' : 'red'};">${r.status}</td>
      </tr>
    `;
  }).join('\n');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Visual Regression Report - ${dateString}</title>
      <style>
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
        th { background-color: #f4f4f4; }
        img { border: 1px solid #ddd; }
      </style>
    </head>
    <body>
      <h1>Visual Regression Report - ${dateString}</h1>
      <table>
        <tr>
          <th>Site</th>
          <th>Page</th>
          <th>Preview</th>
          <th>Live</th>
          <th>Diff</th>
          <th>Pixel Difference</th>
          <th>Status</th>
        </tr>
        ${rows}
      </table>
    </body>
    </html>
  `;

  const reportPath = path.join(outputDir, `report-${dateString}.html`);
  fs.writeFileSync(reportPath, html);
  console.log(`📊 HTML report saved to: ${reportPath}`);
}

test.afterAll(() => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const dateString = `${day}-${month}`;

  const summaryDir = path.join('screenshots', 'summary');
  if (!fs.existsSync(summaryDir)) {
    fs.mkdirSync(summaryDir);
  }

  const summaryPath = path.join(summaryDir, `summary-${dateString}.csv`);
  const header = 'Site,Page,Pixel Difference,Status\n';
  const body = results
    .map(r => `${r.site},${r.label},${r.diff},${r.status}`)
    .join('\n');

  fs.writeFileSync(summaryPath, header + body);
  console.log(`\n📄 Summary saved to: ${summaryPath}`);

  generateHtmlReport(results, dateString, summaryDir);
});

test.describe('Visual regression for all club sites', () => {
  const screenshotsDir = 'screenshots';

  test.beforeAll(() => {
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir);
    }

    const subdirs = ['previews', 'lives', 'diffs'];
    for (const dir of subdirs) {
      const fullPath = `${screenshotsDir}/${dir}`;
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath);
      }
    }

    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const dateString = `${day}-${month}`;

    for (const dir of subdirs) {
      const fullPath = `${screenshotsDir}/${dir}`;
      const files = fs.readdirSync(fullPath);
      for (const file of files) {
        if (file.endsWith('.png') && !file.includes(dateString)) {
          fs.unlinkSync(`${fullPath}/${file}`);
        }
      }
    }
  });

  for (const site of sitesToTest) {
    test.describe(site.name, () => {
      test('Visual regression check (home, news, matches, teams)', async () => {
        test.setTimeout(180000);

        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const dateString = `${day}-${month}`;

        const browser = await chromium.launch();

        try {
          console.log(`--- HOME PAGE TEST: ${site.name} ---`);
          await runVisualTest(browser, 'home', site.previewUrl, site.liveUrl, screenshotsDir, dateString, site.name, site.cookieSelector);
        } catch (e) {
          console.error(`❌ Home test failed for ${site.name} - ${(e as Error).message}`);
        }

        if (site.previewNewsUrl && site.liveNewsUrl) {
          try {
            console.log(`--- NEWS PAGE TEST: ${site.name} ---`);
            await runVisualTest(browser, 'news', site.previewNewsUrl, site.liveNewsUrl, screenshotsDir, dateString, site.name, site.cookieSelector);
          } catch (e) {
            console.error(`❌ News test failed for ${site.name} - ${(e as Error).message}`);
          }
        }

        if (site.previewMatchesUrl && site.liveMatchesUrl) {
          try {
            console.log(`--- MATCHES PAGE TEST: ${site.name} ---`);
            await runVisualTest(browser, 'matches', site.previewMatchesUrl, site.liveMatchesUrl, screenshotsDir, dateString, site.name, site.cookieSelector);
          } catch (e) {
            console.error(`❌ Matches test failed for ${site.name} - ${(e as Error).message}`);
          }
        }

        if (site.previewTeamsUrl && site.liveTeamsUrl) {
          try {
            console.log(`--- TEAMS PAGE TEST: ${site.name} ---`);
            await runVisualTest(browser, 'teams', site.previewTeamsUrl, site.liveTeamsUrl, screenshotsDir, dateString, site.name, site.cookieSelector);
          } catch (e) {
            console.error(`❌ Teams test failed for ${site.name} - ${(e as Error).message}`);
          }
        }

        await browser.close();
      });
    });
  }
});
