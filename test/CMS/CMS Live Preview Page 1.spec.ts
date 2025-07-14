//npx playwright test "test/CMS/CMS Live Preview Page 1.spec.ts" --headed

import { test, expect } from '@playwright/test';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const previewUsername = process.env.PREVIEW_USERNAME || 'urbanzoo';
const previewPassword = process.env.PREVIEW_PASSWORD || 'gamechanger1!';

const SCREENSHOT_DIR = 'screenshots/cms-page-1-preview';
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

test('CMS - Visual Regression: Page 1', async ({ browser }) => {
  const site = {
    preview: 'https://beta.gc.uzstaging1.co.uk/preview/608cfeec-597b-4a38-920e-30db3bb3a160',
  };
/*
Classic Hero - Alignment with Spacing
Content Box 1 = News (Focus QA) Left hand Side
Content Box 2 = Text - LHS - Headings = Paragraph,Heading 2,Heading 3,Heading 4,Heading 5,Heading 6
Content Box 3 = Text - Centre - Headings = Paragraph,Heading 2,Heading 3,Heading 4,Heading 5,Heading 6
Content Box 4 = Text - RHS - Headings = Paragraph,Heading 2,Heading 3,Heading 4,Heading 5,Heading 6

Section 1 - Text Content
Content Box 1 = Text - LHS - Headings = Paragraph,Heading 2,Heading 3,Heading 4,Heading 5,Heading 6,Button 1 
Content Box 2 = Text - Centre - Headings = Paragraph,Heading 2,Heading 3,Heading 4,Heading 5,Heading 6,Button 2 
Content Box 3 = Text - RHS - Headings = Paragraph,Heading 2,Heading 3,Heading 4,Heading 5,Heading 6, Button 3

Section 2 - Rows - 3 Split Container
Content Box 1 = Text - LHS - Headings = Paragraph,Heading 2,Heading 3,Heading 4,Heading 5,Heading 6,Button 1 
Content Box 2 = Text - Centre - Headings = Paragraph,Heading 2,Heading 3,Heading 4,Heading 5,Heading 6,Button 2 
Content Box 3 = Text - RHS - Headings = Paragraph,Heading 2,Heading 3,Heading 4,Heading 5,Heading 6, Button 3

Section 3 - Tab Containers - Content Grid
Left Hand Side Box 1 = News Card - LHS - Focal QA News
Right Hand Side Box 1 = Promo Card - Image, Promo Title, RHS Text
Right Hand Side Box 2 = Promo Card - Stadium Image, Promo Title, RHS Text
Right Hand Side Box 3 = Product - Kit Image

Section 4 - Carousel - Auto Fil 
Box 1 = Mount Returns to training
Box 2 = UZFC Champions bring it home 
Box 3 = Match Preview 
Box 4 = Why Bruno Love the Europa Laeague 
Box 5 = Everton Home Run Derby

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
