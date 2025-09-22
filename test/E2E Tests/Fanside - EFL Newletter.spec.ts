// npx playwright test "test/E2E Tests/Fanside - EFL Newletter.spec.ts" --headed

import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();
const previewUsername = process.env.PREVIEW_USERNAME || 'urbanzoo';
const previewPassword = process.env.PREVIEW_PASSWORD || 'gamechanger1!';

test('EFL.com User Registration Form - DOB Validation', async ({ browser }) => {
  test.setTimeout(120000);
  // --- Create browser context with basic auth ---
  const context = await browser.newContext({
    httpCredentials: {
      username: previewUsername,
      password: previewPassword,
    },
  });
  console.log("🔑 Authenticated with preview credentials");

  // --- Open page ---
  const page = await context.newPage();
  await page.goto('https://livepreview.efl.com/news/newsletter/');
  console.log("Navigated to Newsletter page");

  // --- Accept cookie banner ---
  await page.getByRole('button', { name: 'Accept All Cookies' }).click();
  console.log("Accepted cookies banner");
  await page.waitForTimeout(1000);

  // --- Handle splash screen (if iframe exists) ---
  const frame = await page.locator('#mpu-slot-11010 iframe').contentFrame();
  if (frame) {
    const closeButton = frame.getByRole('link', { name: 'x Continue To Site' });
    if (await closeButton.isVisible().catch(() => false)) {
      await closeButton.click();
      console.log("Splash screen closed");
    } else {
      console.log("Close button not visible, skipping splash screen...");
    }
  } else {
    console.log("No iframe found for splash screen, skipping...");
  }

  // --- Fill out registration form ---
  console.log("Filling out registration form...");

  // Select title
  await page.locator('#vs1__combobox div').first().click();
  await page.getByRole('option', { name: 'Mr', exact: true }).click();
  console.log("Selected title: Mr");

  // Enter first name
  await page.getByRole('textbox', { name: 'First name*' }).fill('Automation');
  console.log("Entered first name");

  // Enter last name
  await page.getByRole('textbox', { name: 'Last name*' }).fill('Automation');
  console.log("Entered last name");

  // Enter postcode
  await page.getByRole('textbox', { name: 'Postcode*' }).fill('WA2 7NG');
  console.log("Entered postcode");

  // Select country
  await page.locator('#vs2__combobox').getByPlaceholder('Country*').click();
  await page.locator('#vs2__option-0').click();
  console.log("Selected country");

  // Generate random email to avoid duplicates
  const randomNum = Math.floor(Math.random() * 9999) + 1;
  const email = `automation+${randomNum}@urbanzoo.io`;
  await page.getByRole('textbox', { name: 'Email address*' }).fill(email);
  console.log(`Entered email: ${email}`);

  // Select club
  await page.locator('#vs3__combobox div').first().click();
  await page.getByRole('option', { name: 'Birmingham City' }).click();
  console.log("Selected club: Birmingham City");

  // Enter invalid DOB (for validation test)
  await page.getByRole('textbox', { name: 'Date of birth*' }).fill('01/01/1800');
  console.log("Entered invalid DOB: 01/01/1800");

  // Enter mobile number
  await page.getByRole('textbox', { name: 'Mobile phone*' }).fill('07777777777');
  console.log("Entered mobile number");

  // Set communication preferences and accept terms
  await page.getByRole('radio', { name: 'No' }).check();
  await page.locator('.newsletter__terms > .toggle-switch').click();
  console.log("Set comms preferences and accepted terms");

  // Submit form
  await page.getByRole('button', { name: 'Sign up' }).click();
  console.log("Clicked Sign up button");

  // --- Validate error message for invalid DOB ---
  await expect(page.getByText('Please enter a valid date of')).toBeVisible();
  await expect(page.getByRole('main')).toContainText('Please enter a valid date of birth AGE');
  console.log("DOB validation message displayed as expected");
});
