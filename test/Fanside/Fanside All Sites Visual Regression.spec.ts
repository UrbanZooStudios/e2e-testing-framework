//  npx playwright test "test/Fanside/Fanside All Sites Visual Regression.spec.ts"
import { test, chromium, Browser, Page, BrowserContext, Route } from '@playwright/test';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { sitesToTest } from '../config/sitesToTest';
dotenv.config();

type VisualTestResult = {
  site: string;
  label: string;
  diff: number;
  status: string;
};

const results: VisualTestResult[] = [];

function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, '_');
}

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

async function autoScroll(page: Page) {
  await page.evaluate(async () => {
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
  await page.waitForTimeout(2000);
}

function normalizeImageSizes(imgA: PNG, imgB: PNG): [PNG, PNG] {
  const width = Math.max(imgA.width, imgB.width);
  const height = Math.max(imgA.height, imgB.height);

  const pad = (img: PNG) => {
    const padded = new PNG({ width, height });
    PNG.bitblt(img, padded, 0, 0, img.width, img.height, 0, 0);
    return padded;
  };

  return [pad(imgA), pad(imgB)];
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
  const slug = slugify(siteName);
  const previewPath = `${screenshotsDir}/previews/${slug}_preview_${label}_${dateString}.png`;
  const livePath = `${screenshotsDir}/lives/${slug}_live_${label}_${dateString}.png`;
  const diffPath = `${screenshotsDir}/diffs/${slug}_diff_${label}_${dateString}.png`;

  console.log(`🧪 Testing ${siteName} - ${label}`);

  const contextPreview = await browser.newContext({
    httpCredentials: {
      username: process.env.PREVIEW_USERNAME || 'urbanzoo',
      password: process.env.PREVIEW_PASSWORD || 'gamechanger1!',
    },
  });
  blockAdRequests(contextPreview);
  const pagePreview = await contextPreview.newPage();
  await pagePreview.setViewportSize({ width: 1280, height: 800 });
  await pagePreview.goto(previewUrl, { timeout: 60000, waitUntil: 'load' });
  await acceptCookiesIfPresent(pagePreview, cookieSelector);
  await autoScroll(pagePreview);
  await pagePreview.screenshot({ path: previewPath, fullPage: true });

  const contextLive = await browser.newContext();
  blockAdRequests(contextLive);
  const pageLive = await contextLive.newPage();
  await pageLive.setViewportSize({ width: 1280, height: 800 });
  await pageLive.goto(liveUrl, { timeout: 60000, waitUntil: 'load' });
  await acceptCookiesIfPresent(pageLive, cookieSelector);
  await autoScroll(pageLive);
  await pageLive.screenshot({ path: livePath, fullPage: true });

  const img1 = PNG.sync.read(fs.readFileSync(previewPath));
  const img2 = PNG.sync.read(fs.readFileSync(livePath));
  const [img1Norm, img2Norm] = normalizeImageSizes(img1, img2);
  const diff = new PNG({ width: img1Norm.width, height: img1Norm.height });

  let pixelDiff = 0;
  let status = 'PASS';

  try {
    pixelDiff = pixelmatch(
      img1Norm.data,
      img2Norm.data,
      diff.data,
      img1Norm.width,
      img1Norm.height,
      { threshold: 0.1 }
    );
    fs.writeFileSync(diffPath, PNG.sync.write(diff));
    if (pixelDiff >= 100) status = 'FAIL';
  } catch (err) {
    status = 'FAIL';
    pixelDiff = -1;
    console.error(`⚠️ Comparison failed for ${siteName} - ${label}:`, err);
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
    const slug = slugify(r.site);
    return `
      <tr>
        <td>${r.site}</td>
        <td>${r.label}</td>
        <td><img src="../previews/${slug}_preview_${r.label}_${dateString}.png" width="300"/></td>
        <td><img src="../lives/${slug}_live_${r.label}_${dateString}.png" width="300"/></td>
        <td><img src="../diffs/${slug}_diff_${r.label}_${dateString}.png" width="300"/></td>
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
  const dateString = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const summaryDir = path.join('screenshots', 'summary');
  if (!fs.existsSync(summaryDir)) fs.mkdirSync(summaryDir, { recursive: true });

  const csv = results.map(r => `${r.site},${r.label},${r.diff},${r.status}`).join('\n');
  fs.writeFileSync(path.join(summaryDir, `summary-${dateString}.csv`), `Site,Page,Pixel Difference,Status\n${csv}`);
  generateHtmlReport(results, dateString, summaryDir);
});

test.describe('Fanside Visual Regression - Flat Folder Layout', () => {
  const screenshotsDir = 'screenshots';

  test.beforeAll(() => {
    ['previews', 'lives', 'diffs'].forEach(dir => {
      const full = path.join(screenshotsDir, dir);
      if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });

      const today = new Date();
      const dateString = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}`;
      const files = fs.readdirSync(full);
      for (const file of files) {
        if (file.endsWith('.png') && !file.includes(dateString)) {
          fs.unlinkSync(path.join(full, file));
        }
      }
    });
  });

  for (const site of sitesToTest) {
    test.describe(site.name, () => {
      test('Visual regression check (home, news, matches, teams)', async () => {
        const today = new Date();
        const dateString = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}`;
        const browser = await chromium.launch();

        const pages = [
          { label: 'home', preview: site.previewUrl, live: site.liveUrl },
          { label: 'news', preview: site.previewNewsUrl, live: site.liveNewsUrl },
          { label: 'matches', preview: site.previewMatchesUrl, live: site.liveMatchesUrl },
          { label: 'teams', preview: site.previewTeamsUrl, live: site.liveTeamsUrl },
        ];

        for (const page of pages) {
          if (page.preview && page.live) {
            try {
              await runVisualTest(browser, page.label, page.preview, page.live, screenshotsDir, dateString, site.name, site.cookieSelector);
            } catch (e) {
              console.error(`❌ ${page.label} test failed for ${site.name} - ${(e as Error).message}`);
            }
          }
        }

        await browser.close();
      });
    });
  }
});
