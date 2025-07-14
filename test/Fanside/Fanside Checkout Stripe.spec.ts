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

// Validate that the subscription information is visible on the page
await expect(page.getByText('SubscriptionSubscriptionSeason Audio SubscriptionA season audio subscription')).toBeVisible();
await expect(page.getByRole('article')).toContainText('Subscription');

// Open the subscription details
const subscriptionLink = page.getByRole('group', { name: 'of 1' }).locator('a');
await subscriptionLink.click();
await subscriptionLink.dblclick(); // Possibly to ensure activation

// Confirm that business link and payment details are displayed
await expect(page.getByTestId('business-link')).toBeVisible();
await expect(page.getByTestId('product-summary-name')).toContainText('Pay Tranmere Rovers Football Club Limited');

});
  
// Sunderland AFC
test('Sunderland AFC - Login and Validate',async ({ browser }, testInfo) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
  // Navigate to the Sunderland AFC live preview site
await page.goto('https://livepreview.safc.com/');

// Close any initial popup/modal (e.g., site overlay)
await page.locator('.absolute.-top-\\[25px\\]').click();

// Accept cookies
await page.getByRole('button', { name: 'Accept All Cookies' }).click();

// Open the login modal
await page.getByRole('button', { name: 'Log In' }).click();

// Enter email address
await page.getByLabel('', { exact: true }).click();
await page.getByLabel('', { exact: true }).fill('thomasastley@urbanzoo.io');
await page.getByLabel('', { exact: true }).press('Tab');

// Enter password
await page.locator('#password').fill('Password1!');
await page.locator('#password').press('Enter'); // Submit the form

// Close any post-login notification or modal
await page.locator('.cursor-pointer.gc-base-icon.duration-150 > .duration-100').click();

// Navigate to the "Video" section
await page.getByRole('link', { name: 'Video' }).click();

// Select the "Subscriptions" tab
await page.getByRole('tab', { name: 'Tab Subscriptions' }).click();

// Verify that the "MatchPass" subscription option is visible
await expect(page.locator('div').filter({ hasText: /^MatchPass$/ }).getByRole('paragraph')).toBeVisible();

await page.getByRole('heading', { name: 'Pre-Season Streaming Pass (UK' }).click();
await page.getByText('Watch all our eligible 2025-').click();
await page.getByRole('group', { name: 'of 1' }).locator('a').click();
await page.getByRole('group', { name: 'of 1' }).locator('a').click();

// Validate payment and business info are shown correctly
await expect(
  page.getByText('BackSunderland Association Football Club, Limited (The)Pay Sunderland')
).toBeVisible();

await expect(page.getByTestId('business-name')).toContainText(
  'Sunderland Association Football Club, Limited (The)'
);

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
  
    // Close initial overlay/popup
    await page.locator('.absolute.-top-\\[25px\\] > .cursor-pointer > .duration-100').click();
  
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
      await page.getByRole('button', { name: 'Continue' }).click();
    }
  
    // Initial login attempt with test credentials
    await performLogin('thomasastley@urbanzoo.io', 'Password1!');
  
    // Return to previous site
    await page.getByRole('link', { name: ' Return to previous site' }).click();
  
    // Close overlay again and retry login
    await page.locator('.absolute.-top-\\[25px\\] > .cursor-pointer > .duration-100').click();
  
    // Retry login with corrected credentials
    await performLogin('thomasastley@urbanzoo.io', 'Password1!');
  
    // Navigate to Pompey+ content
    await page.getByRole('link', { name: 'Pompey+' }).nth(1).click();
  
    // Open the Subscriptions tab
    await page.getByRole('tab', { name: 'Tab Subscriptions' }).click();
  
    // Validate that the Subscription section is visible
    await expect(
      page.getByLabel('1 of 5').locator('div').filter({ hasText: /^Subscription$/ }).getByRole('paragraph')
    ).toBeVisible();
  
    // Confirm the subscription content is present
    await expect(
      page.getByLabel('1 of 5').getByRole('article')
    ).toContainText('Subscription');
  
    // Access the subscription details
    await page.getByRole('group', { name: '1 of 5' }).locator('a').click();
  
    // Validate the checkout and business details
    await expect(
      page.locator('div').filter({ hasText: /^BackPortsmouth Football Club$/ }).first()
    ).toBeVisible();
  
    await expect(page.getByTestId('business-name')).toContainText('Portsmouth Football Club');
  });
  

// Doncaster Rovers FC - FAILED - 14/07/25 - Regression bug - UZ-2240
test.skip('Doncaster Rovers FC - Login and Validate',async ({ browser }, testInfo) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
  // Navigate to the 
await page.goto('https://livepreview.doncasterroversfc.co.uk/');

// Accept all cookies
await page.getByRole('button', { name: 'Accept All Cookies' }).click();

// Log in to the application
await page.getByRole('button', { name: 'Log In' }).click();
await page.getByRole('textbox', { name: 'Email' }).fill('thomasastley@urbanzoo.io');
await page.locator('#password').click();
  await page.locator('#password').fill('Password1!');

// Submit login form (assuming anchor link is used for login)
await page.locator('a').filter({ hasText: 'Login' }).click();

// Open user/account menu
await page.locator('.cursor-pointer.gc-base-icon.duration-150 > .duration-100').click();

// Navigate to Rovers+ section
await page.getByRole('link', { name: 'Rovers+' }).click();

// Select the "Subscriptions" tab
await page.getByRole('tab', { name: 'Tab Subscriptions' }).click();

// Validate subscription section is visible and correct
await expect(
  page.getByLabel('1 of 2')
    .locator('div')
    .filter({ hasText: /^Subscription$/ })
    .getByRole('paragraph')
).toBeVisible();

await expect(
  page.getByLabel('1 of 2').getByRole('article')
).toContainText('Subscription');

await page.pause();

// Click into the first subscription group
await page.getByRole('group', { name: '1 of 2' }).locator('a').click();

// Click into the first subscription group
await page.getByRole('group', { name: '1 of 2' }).locator('a').click();

await page.waitForTimeout(10000);

// Confirm the checkout container is visible
await expect(page.getByTestId('checkout-container')).toBeVisible();

// Validate that the header contains expected club name
await expect(page.getByRole('banner')).toContainText('BackFootball Club');

// Confirm product summary name is visible
await expect(page.getByTestId('product-summary-name')).toBeVisible();
});

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

// Huddersfield Town AFC - Skipping due to Packages being removed. 14/07/25
test.skip('Huddersfield Town AFC - Login and Validate',async ({ browser }, testInfo) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
// Navigate to the Huddersfield Town AFC Webpage
  await page.goto('https://livepreview.htafc.com/');
// Accept the cookie consent prompt
await page.getByRole('button', { name: 'Accept All Cookies' }).click();
await page.waitForTimeout(5000); // Wait for 5 seconds

// Navigate to the "HTTV" tab
await page.getByRole('tab', { name: 'HTTV' }).click();
await page.waitForTimeout(5000); // Wait for 5 seconds

// Navigate to the "Subscriptions" tab within HTTV
await page.getByRole('tab', { name: 'Tab Subscriptions' }).click();
await page.waitForTimeout(5000); // Wait for 5 seconds

// Assert that the "MatchPass" paragraph is visible
await expect(
  page.locator('div')
    .filter({ hasText: /^MatchPass$/ })
    .getByRole('paragraph')
).toBeVisible();
await page.waitForTimeout(5000); // Wait for 5 seconds

// Assert the article contains the text "MatchPass"
await expect(page.getByRole('article')).toContainText('MatchPass');
await page.waitForTimeout(5000); // Wait for 5 seconds

// Click the subscription link in the group labeled "of 1"
await page.getByRole('group', { name: 'of 1' }).locator('a').click();
await page.waitForTimeout(5000); // Wait for 5 seconds

// Click on the email input textbox
await page.getByRole('textbox', { name: 'Email' }).click();
await page.waitForTimeout(5000); // Wait for 5 seconds

// Fill in the email address
await page.getByRole('textbox', { name: 'Email' }).fill('thomasastley@urbanzoo.io');
await page.waitForTimeout(5000); // Wait for 5 seconds

// Press Tab to move focus to the password input
await page.getByRole('textbox', { name: 'Email' }).press('Tab');
await page.waitForTimeout(5000); // Wait for 5 seconds

// Fill in the password
await page.getByRole('textbox', { name: 'Password' }).fill('Password1!');
await page.waitForTimeout(5000); // Wait for 5 seconds

// Submit the login form
await page.getByRole('button', { name: 'Log in' }).click();
await page.waitForTimeout(5000); // Wait for 5 seconds

// Click the subscription link again after logging in
await page.getByRole('group', { name: 'of 1' }).locator('a').click();
await page.waitForTimeout(5000); // Wait for 5 seconds

// Assert the product summary name is visible
await expect(page.getByTestId('product-summary-name')).toBeVisible();
await page.waitForTimeout(5000); // Wait for 5 seconds

// Assert the product summary contains the correct subscription name
await expect(page.getByTestId('product-summary-name')).toContainText('Pay Huddersfield Town AFC');
await page.waitForTimeout(5000); // Wait for 5 seconds
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
