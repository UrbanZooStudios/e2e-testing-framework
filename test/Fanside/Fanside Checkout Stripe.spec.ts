// npx playwright test "test/Fanside/Fanside Checkout Stripe.spec.ts" --headed

// Script Notes:
// - AFC Bournemouth (AFCB): LivePreview data incorrectly points to "LIVE" instead of "LivePreview"
// - Everton FC: Blocked by Cloudflare bot protection
// - Derby County: Blocked by Cloudflare bot protection
// - Bradford City FC: No active subscriptions available
// - Millwall FC: Blocked by Cloudflare bot protection

import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

const email = process.env.PLAYWRIGHT_EMAIL;
const password = process.env.PLAYWRIGHT_PASSWORD;
const previewUsername = process.env.PREVIEW_USERNAME || 'urbanzoo';
const previewPassword = process.env.PREVIEW_PASSWORD || 'gamechanger1!';

if (!email || !password) {
  throw new Error("PLAYWRIGHT_EMAIL or PLAYWRIGHT_PASSWORD is not set.");
}

// Tranmere Rovers
test('Tranmere - Login and Validate', async ({ browser }, testInfo) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
  
// Navigate to the Tranmere Rovers live preview site
await page.goto('https://livepreview.tranmererovers.co.uk/');

// Close any initial popup/modal (e.g., banners, overlays)
//await page.locator('.w-screen > .relative > .absolute').click();

// Accept all cookies
await page.getByRole('button', { name: 'Accept All Cookies' }).click();

// Open the login modal
await page.getByRole('button', { name: 'Log In' }).click();

// Fill in the email address
await page.getByLabel('', { exact: true }).click();
await page.getByLabel('', { exact: true }).fill('thomasastley@urbanzoo.io');
await page.getByLabel('', { exact: true }).press('Tab');

// Fill in the password field
await page.locator('#password').fill('Password1!');

// Click the Login button
await page.locator('a').filter({ hasText: /^Login$/ }).click();

// Close any notification or popup after login (e.g., alerts or overlays)
await page.locator('.cursor-pointer.gc-base-icon.duration-150 > .duration-100 > use').click();

// Wait for 10 seconds to ensure all elements load properly
await page.waitForTimeout(10000);

// Navigate to the "RoversTV" section
await page.getByRole('link', { name: 'RoversTV', exact: true }).click();

// Select the "Subscriptions" tab
await page.getByRole('tab', { name: 'Tab Subscriptions' }).click();
await page.waitForSelector('text=Season Audio Subscription', { timeout: 10000 });

// Validate that the subscription information is visible on the page
await expect(page.getByLabel('1 of 2').locator('div').filter({ hasText: /^Subscription$/ })).toBeVisible();

// Open the subscription details
const subscriptionLink = page.getByRole('group', { name: 'of 1' }).locator('a');
await page.getByRole('group', { name: '1 of 2' }).getByRole('img').click();
await page.getByRole('group', { name: '1 of 2' }).locator('a').click();

// Confirm that business link and payment details are displayed
await expect(page.getByTestId('business-link')).toBeVisible();

});
  
// Walsall FC
test('Walsall FC - Login and Validate',async ({ browser }, testInfo) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
 // Navigate to the Walsall FC live preview site
await page.goto('https://livepreview.saddlers.co.uk/');

// Accept all cookies
await page.getByRole('button', { name: 'Accept All Cookies' }).click();
await page.waitForTimeout(5000); // Wait for 5 seconds

const splashButton = page.locator('.absolute.-top-\\[25px\\]');

if (await splashButton.isVisible()) {
  await splashButton.click();
  console.log('✅ Splash screen closed');
} else {
  console.log('⚠️ Splash screen not found, skipping...');
}

// Open the login modal
await page.locator('button').filter({ hasText: 'Log in' }).click();

// Fill in the email address
await page.getByLabel('', { exact: true }).click();
await page.getByLabel('', { exact: true }).fill('thomasastley@urbanzoo.io');
await page.getByLabel('', { exact: true }).press('Tab');

// Fill in the password
await page.locator('#password').fill('Password1!');

// Click the "Login" button
await page.locator('a').filter({ hasText: 'Login' }).click();
await page.waitForTimeout(5000); // Wait for 5 seconds

// Close any post-login modal or notification
await page.locator('.cursor-pointer.gc-base-icon.duration-150 > .duration-100').click();

// Navigate to the "Saddlers+" tab
await page.getByRole('tab', { name: 'Saddlers+' }).click();

// Click on the 'Tab Subscriptions' tab
await page.getByRole('tab', { name: 'Tab Subscriptions' }).click();

// Assert that the first subscription section contains a visible paragraph labeled 'Subscription'
await expect(
  page.getByLabel('1 of 2').locator('div').filter({ hasText: /^Subscription$/ }).getByRole('paragraph')
).toBeVisible();

// Assert that the first article under '1 of 2' label contains the text 'Subscription'
await expect(
  page.getByLabel('1 of 2').getByRole('article')
).toContainText('Subscription');

// Click on the image (possibly a thumbnail or icon) within the '1 of 2' group
await page.getByRole('group', { name: '1 of 2' }).getByRole('img').click();

// Click on the heading titled 'Annual Audio Pass'
await page.getByRole('heading', { name: 'Annual Audio Pass' }).click();

// Click on the text element that includes 'SubscriptionAnnual Audio' (likely to open details)
await page.getByText('SubscriptionAnnual Audio').click();

// Click on the link inside the '1 of 2' group (possibly to manage or purchase the subscription)
await page.getByRole('group', { name: '1 of 2' }).locator('a').click();

// Validate the checkout container and business name are visible
await expect(page.getByTestId('checkout-container')).toBeVisible();
await expect(page.getByTestId('business-name')).toContainText('The Walsall Football Club Limited');
});

// Portsmouth FC
test('Portsmouth FC - Login and Validate', async ({ browser }, testInfo) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
  
    // Navigate to the Portsmouth FC preview site
    await page.goto('https://livepreview.portsmouthfc.co.uk/');

    // Accept all cookies
    await page.getByRole('button', { name: 'Accept All Cookies' }).click();

    const splashButton1 = page.locator('.absolute.-top-\\[25px\\]');

    if (await splashButton1.isVisible()) {
      await splashButton1.click();
      console.log('✅ Splash screen closed');
    } else {
      console.log('⚠️ Splash screen not found, skipping...');
    }

// Function to perform login sequence
async function performLogin(email: string, password: string) {
// Open login modal
await page.locator('button').filter({ hasText: 'Log in' }).click();
  
// Enter email
await page.getByRole('textbox', { name: 'Email' }).click();
await page.getByRole('textbox', { name: 'Email' }).fill(email);
await page.getByRole('textbox', { name: 'Email' }).press('Tab');
  
// Enter password
await page.getByRole('textbox', { name: 'Password' }).fill(password);
  
// Submit form
await page.getByRole('button', { name: 'Continue' }).click();}
  
// Initial login attempt with test credentials
await performLogin('thomasastley@urbanzoo.io', 'Password1!');
  
// Retry login with corrected credentials
await performLogin('thomasastley@urbanzoo.io', 'Password1!');

    // Close any initial popup/modal (e.g., site overlay)
const splashButton = page.locator('.absolute.-top-\\[25px\\]');

if (await splashButton.isVisible()) {
  await splashButton.click();
  console.log('✅ Splash screen closed');
} else {
  console.log('⚠️ Splash screen not found, skipping...');
}
  
// Navigate to Pompey+ content
await page.getByRole('link', { name: 'Pompey+' }).nth(1).click();
  
// Open the Subscriptions tab
await page.getByRole('tab', { name: 'Tab Subscriptions' }).click();
  
// Validate that the Subscription section is visible
await expect(page.getByRole('article').filter({ hasText: 'SubscriptionSubscriptionSeason Pass | Premium ContentYour season pass to access' }).getByRole('paragraph').first()).toBeVisible()
  
// Access the subscription details
await page.locator('a').filter({ hasText: 'Buy Now For £54.99' }).click();
  
// Validate the checkout and business details
await expect(page.locator('div').filter({ hasText: /^BackPortsmouth Football Club$/ }).first()).toBeVisible();
await expect(page.getByTestId('business-name')).toContainText('Portsmouth Football Club');});
  
// Notts County FC
test('Notts County FC - Login and Validate',async ({ browser }, testInfo) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
// Navigate to the Notts County live preview website
await page.goto('https://livepreview.nottscountyfc.co.uk/');

// Close any overlay/modal (e.g. promotional banners or popups)
await page.locator('.absolute.-top-\\[25px\\] > .cursor-pointer > .duration-100 > use').click();

// Accept cookie consent
await page.getByRole('button', { name: 'Accept All Cookies' }).click();

// Open the login form
await page.getByRole('button', { name: 'Log In' }).click();

// Fill in login credentials
await page.getByLabel('', { exact: true }).fill('thomasastley@urbanzoo.io'); // Email input with empty label
await page.getByLabel('', { exact: true }).press('Tab'); // Move focus to the password field
await page.locator('#password').fill('Password1!'); // Fill password

// Submit the login form (assuming anchor link is styled as a login button)
await page.locator('a').filter({ hasText: /^Login$/ }).click();

// Open user account menu (profile icon typically)
await page.locator('.cursor-pointer.gc-base-icon.duration-150 > .duration-100').click();

// Navigate to the "PiesPlayer" content section
await page.getByRole('link', { name: 'PiesPlayer' }).click();

// Switch to the "Subscriptions" tab
await page.getByRole('tab', { name: 'Tab Subscriptions' }).click();

// Verify that the subscription block is visible
await expect(
  page.getByLabel('1 of 2')
    .locator('div')
    .filter({ hasText: /^Subscription$/ })
).toBeVisible();

// Confirm that the article within the labeled section contains "Subscription"
await expect(
  page.getByLabel('1 of 2').getByRole('article')
).toContainText('Subscription');

// Click on the subscription entry to view details
await page.getByRole('group', { name: '1 of 2' }).locator('a').click();

// Validate that the business information is visible
await expect(page.getByTestId('business-link')).toBeVisible();
await expect(page.getByTestId('business-name')).toContainText('Notts County Football Club Limited');

// Verify the product summary information is displayed correctly
await expect(page.getByTestId('product-summary-name')).toBeVisible();
await expect(page.getByTestId('product-summary-name')).toContainText('Subscribe to ANNUAL AUDIO PASS');

});

// AFC Wimbledon
test('AFC Wimbledon - Login and Validate',async ({ browser }, testInfo) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
// Navigate to the AFC Wimbledon Website
await page.goto('https://livepreview.afcwimbledon.co.uk/');
await page.waitForLoadState('networkidle');

const locator = page.locator('.absolute.-top-\\[25px\\]');
if (await locator.isVisible()) {
  await locator.click();
} else {
  console.log("Element not visible, skipping click.");
}
// Accept all cookies
await page.getByRole('button', { name: 'Accept All Cookies' }).click();
  
// Click the "Log In" button
await page.getByRole('button', { name: 'Log In' }).click();

// Click on the email input field (label is empty — consider improving accessibility)
await page.getByLabel('', { exact: true }).click();

// Enter the email address
await page.getByLabel('', { exact: true }).fill('thomasastley@urbanzoo.io');

// Press Tab to move focus to the password field
await page.getByLabel('', { exact: true }).press('Tab');

// Fill the password field with an incorrect password (note: possibly intentional for testing failure)
await page.locator('#password').fill('Password1!');

// Click the "Login" link or button (based on text "Login")
await page.locator('a').filter({ hasText: /^Login$/ }).click();

// Click on a navigation icon (selector is brittle — recommend using test ID or accessible name)
await page.locator('.cursor-pointer.gc-base-icon.duration-150 > .duration-100').click();

// Navigate to the "DonsTV" section
await page.getByRole('link', { name: 'DonsTV' }).click();

// Switch to the "Subscriptions" tab
await page.getByRole('tab', { name: 'Tab Subscriptions' }).click();

// Assert that the "Subscription" paragraph is visible in the first panel
await expect(
  page.getByLabel('1 of 2')
    .locator('div')
    .filter({ hasText: /^Subscription$/ })
    .getByRole('paragraph')
).toBeVisible();

// Assert that the article in the first panel contains the text "Subscription"
await expect(
  page.getByLabel('1 of 2').getByRole('article')
).toContainText('Subscription');

// Click the subscription detail link in the first panel
await page.getByRole('group', { name: '1 of 2' }).locator('a').click();

// Assert the business link is visible
await expect(page.getByTestId('business-link')).toBeVisible();

// Assert the business name is "AFC Wimbledon"
await expect(page.getByTestId('business-name')).toContainText('AFC Wimbledon');

// Assert the product summary name is visible
await expect(page.getByTestId('product-summary-name')).toBeVisible();

// Assert the product summary contains the correct subscription name
await expect(page.getByTestId('product-summary-name')).toContainText('Subscribe to Audio Month Pass');
});

// Oldham Athletic AFC
test('Oldham Athletic AFC - Login and Validate',async ({ browser }, testInfo) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
// Navigate to the Oldham Athletic AFC Website
  await page.goto('https://livepreview.oldhamathletic.co.uk/');

// Accept the cookie consent banner
await page.getByRole('button', { name: 'Accept All Cookies' }).click();

// Click the "Log In" button
await page.getByRole('button', { name: 'Log In' }).click();

// Click on the email input field (label is empty — consider improving accessibility)
await page.getByLabel('', { exact: true }).click();

// Fill in the email address
await page.getByLabel('', { exact: true }).fill('thomasastley@urbanzoo.io');

// Press Tab to move focus to the password input
await page.getByLabel('', { exact: true }).press('Tab');

// Fill in the password
await page.locator('#password').fill('Password1!');

// Click the "Login" link/button
await page.locator('a').filter({ hasText: 'Login' }).click();

// Click the navigation icon (SVG icon — selector is fragile; consider using test ID)
await page.locator('.cursor-pointer.gc-base-icon.duration-150 > .duration-100 > use').click();

// Navigate to the "Latics Player" section
await page.getByRole('link', { name: 'Latics Player', exact: true }).click();

// Navigate to the "Subscriptions" tab
await page.getByRole('tab', { name: 'Tab Subscriptions' }).click();

// Verify that the "Subscription" paragraph is visible in panel 1 of 2
await expect(
  page.getByLabel('1 of 2')
    .locator('div')
    .filter({ hasText: /^Subscription$/ })
    .getByRole('paragraph')
).toBeVisible();

// Assert that the article in panel 1 of 2 contains "Subscription"
await expect(
  page.getByLabel('1 of 2').getByRole('article')
).toContainText('Subscription');

// Click the subscription link in group "1 of 2"
await page.getByRole('group', { name: '1 of 2' }).locator('a').click();

// Assert the business link is visible
await expect(page.getByTestId('business-link')).toBeVisible();

// Assert the product summary contains correct subscription name
await expect(page.getByTestId('product-summary-name')).toContainText('Subscribe to Monthly Audio Pass');
});
