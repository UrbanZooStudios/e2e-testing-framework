//npx playwright test "test/PageBuilder/CMS Live Preview Page 2.spec.ts" --headed
import { test, expect } from '@playwright/test';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const previewUsername = process.env.PREVIEW_USERNAME || 'urbanzoo';
const previewPassword = process.env.PREVIEW_PASSWORD || 'gamechanger1!';

const SCREENSHOT_DIR = 'screenshots/cms-page-2-preview';
const MASTER_IMAGE = `${SCREENSHOT_DIR}/master.png`;
const CURRENT_IMAGE = `${SCREENSHOT_DIR}/current.png`;
const DIFF_IMAGE = `${SCREENSHOT_DIR}/diff.png`;

function normalizeImageSizes(imgA: PNG, imgB: PNG): [PNG, PNG] {
  const width = Math.max(imgA.width, imgB.width);
  const height = Math.max(imgA.height, imgB.height);

  const pad = (img: PNG) => {
    const out = new PNG({ width, height });
    PNG.bitblt(img, out, 0, 0, img.width, img.height, 0, 0);
    return out;
  };

  return [pad(imgA), pad(imgB)];
}

test('CMS - Visual Regression: Page 2', async ({ browser }) => {
  const site = {
    preview: 'https://beta.gc.uzstaging1.co.uk/preview/4ad61ad9-9f8b-4c94-af91-b19c6904f101',
  };
/*
Default Hero 1 = Container, Layout = Deep, Style = Foreground image, Trainsition = None
Section 1 - Images Layout = Image 1 = Narrow, Image 2 = Standard, Image 3 = Full Width  
Section 2 - Gallery Widget = Image 1 = Standard, Image 2 = Wide,Image 3 = Full Width, DEFECT - Gallery Widget
Section 3 - Row - 1 Split Container - Gallery Widget - Image 1 = Standard, Image 2 = Wide,Image 3 = Full Width, DEFECT - Gallery Widget

*/

  const context = await browser.newContext({
    httpCredentials: {
      username: previewUsername,
      password: previewPassword,
    },
  });

  const page = await context.newPage();
  await page.goto(site.preview);
  await page.waitForLoadState('load');

  // Wait an extra 10 seconds for full content load
  await page.waitForTimeout(10000);

  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  await page.screenshot({ path: CURRENT_IMAGE, fullPage: true });

  if (!fs.existsSync(MASTER_IMAGE)) {
    fs.copyFileSync(CURRENT_IMAGE, MASTER_IMAGE);
    console.log('Master image created. Future tests will compare against this.');
    return;
  }

  const masterImg = PNG.sync.read(fs.readFileSync(MASTER_IMAGE));
  const currentImg = PNG.sync.read(fs.readFileSync(CURRENT_IMAGE));
  const [img1, img2] = normalizeImageSizes(masterImg, currentImg);
  const diff = new PNG({ width: img1.width, height: img1.height });

  const pixelDiff = pixelmatch(
    img1.data,
    img2.data,
    diff.data,
    img1.width,
    img1.height,
    { threshold: 0.1 }
  );

  fs.writeFileSync(DIFF_IMAGE, PNG.sync.write(diff));
  console.log(`Visual diff pixel count: ${pixelDiff}`);

  // Optional: fail the test if too many differences
  expect(pixelDiff).toBeLessThan(500); // Tweak as needed
});
