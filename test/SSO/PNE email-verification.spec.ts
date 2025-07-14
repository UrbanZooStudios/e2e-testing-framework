// TO RUN THIS SCRIPT:  npx playwright test test/SSO/PNE email-verification.spec.ts --headed 
// IMPORTANT: DELETE ALL EMAILS BEFORE RUNNING THIS SCRIPT await page.pause();

import { test, expect, Page } from '@playwright/test';
import { waitForVerificationCode } from '../Utils/gmail-helper';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config(); // Load env vars

// Function to accept cookie banners if present using a list of fallback selectors.
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
    } catch {
      // Ignore errors for missing or non-interactable elements
    }
  }
}

// REGISTRATION TEST
test('SSO Register Flow', async ({ browser }) => {
  // Create a new browser context with HTTP auth...
  const context = await browser.newContext({
    httpCredentials: {
      username: process.env.PREVIEW_USERNAME || 'urbanzoo',
      password: process.env.PREVIEW_PASSWORD || 'gamechanger1!',
    },
  });

  const page = await context.newPage();
  await page.goto('https://livepreview.pnefc.net/sso/register');

  // Generate test data
  const firstName = 'Automation Test';
  const lastName = 'Automation Test';
  const randomNum = Math.floor(Math.random() * 9999) + 1;
  const email = `thomasastley+${randomNum}@urbanzoo.io`;
  const password = 'PAssword1!';

  // Save generated credentials to a file for reuse
  const credentialsPath = path.resolve(__dirname, '../tmp/credentials.json');
  fs.mkdirSync(path.dirname(credentialsPath), { recursive: true });
  fs.writeFileSync(credentialsPath, JSON.stringify({ email, password }));

  // Accept cookies if present
  await acceptCookiesIfPresent(page);
  await page.locator('.absolute > .cursor-pointer > .duration-100 > use').click();

  // Fill out the registration form
  const titleDropdown = page.getByLabel('TitleMrDrMrsMissMs');
  await titleDropdown.selectOption({ label: 'Mr' });

  await page.getByPlaceholder('First name').fill(firstName);
  await page.getByPlaceholder('Last name').fill(lastName);
  await page.getByPlaceholder('Email address', { exact: true }).fill(email);
  await page.getByPlaceholder('Confirm email address').fill(email);
  await page.getByPlaceholder('Password', { exact: true }).fill(password);
  await page.getByPlaceholder('Confirm password').fill(password);

  await page.locator('a', { hasText: 'Continue' }).click();

  // Fill additional personal details
  await page.getByPlaceholder('Mobile number').fill('07777777777');
  await page.getByPlaceholder('Post code*').fill('sw1 1la');
  await page.getByPlaceholder('Date of birth*').fill('1992-07-10');
  await page.locator('a', { hasText: 'Continue' }).click();

  // Wait for iFollow section
  await expect(page.locator('div').filter({ hasText: /^iFollow$/ })).toBeVisible();

  // Make selections in iFollow preferences
  await page.getByRole('radio').first().check();
  await page.getByRole('radio').nth(1).check();
  await page.getByRole('radio').nth(2).check();

  await page.getByRole('checkbox').nth(1).check(); // Terms & Conditions
  await page.locator('div').filter({ hasText: /^More Options$/ }).first().click();
  await page.getByRole('radio').nth(2).check();

  // Check all preference checkboxes
  const preferenceCheckboxes = [0, 1, 2, 3];
  for (const i of preferenceCheckboxes) {
    await page.getByRole('checkbox').nth(2 + i).check();
  }

  // Set communication preferences
  const commsSection = page.locator('div').filter({ hasText: /^EmailSMSAutomated phone callsOnline direct messages\?$/ });
  await commsSection.getByRole('checkbox').nth(1).check();
  await commsSection.getByRole('checkbox').nth(2).check();
  await commsSection.getByRole('checkbox').nth(3).check();

  // Check agreement box
  await page.locator('.flex > div > div:nth-child(4) > div > .flex > .basis-\\[16px\\]').check();

  // Submit registration form
  await page.locator('a').filter({ hasText: 'Register' }).click();

  // Verify registration success message
  await expect(page.getByRole('main')).toContainText('Successfully Registered');
  await expect(page.getByRole('main')).toContainText('Verify and Login');

  // Fill in login details on verification step
  await page.getByPlaceholder('Email', { exact: true }).fill(email);
  await page.getByPlaceholder('Password').fill(password);

  // Fetch the verification code from email
  const subjectFilter = 'Your Preston North End FC sign-on verification code';
  const verificationCode = await waitForVerificationCode(subjectFilter);

  if (!verificationCode) {
    throw new Error('Failed to retrieve verification code from email.');
  }

  // Submit verification code
  await page.getByPlaceholder('Verification Code').fill(verificationCode);
  console.log('✅ Using verification code:', verificationCode);

  // Click Verify Account
  await page.locator('a').filter({ hasText: 'Verify Account' }).click();
  // Verify post-verification success
  await expect(page.getByText('Account verified successfully')).toBeVisible();
  await page.waitForTimeout(1000);

  await page.getByRole('alert').filter({ hasText: 'Account verified successfully' }).click();
  await expect(page.locator('transitionlist')).toContainText('Account verified successfully');
  await expect(page.getByText('Successfully logged in')).toBeVisible();

  // Click into Manage Account section
  await page.getByRole('link', { name: 'Manage Account' }).click();

  // Accept cookies again if prompted
  await page.getByRole('button', { name: 'Accept All Cookies' }).click();
  await page.locator('.w-screen > .relative > .absolute').click();
});

// LOGIN TEST
test('SSO Login Flow - Manage Account', async ({ browser }) => {
  // Define path to the saved credentials file from the registration test
  const credentialsPath = path.resolve(__dirname, '../tmp/credentials.json');

  // Ensure credentials file exists before proceeding
  if (!fs.existsSync(credentialsPath)) {
    throw new Error('Credentials file not found. Run the registration test first.');
  }

  // Load the email and password from the saved JSON file
  const { email, password } = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));

  // Create a new browser context with basic authentication for the preview environment
  const context = await browser.newContext({
    httpCredentials: {
      username: process.env.PREVIEW_USERNAME || 'urbanzoo',
      password: process.env.PREVIEW_PASSWORD || 'gamechanger1!',
    },
  });

  // Open a new page and navigate to the login URL
  const page = await context.newPage();
  const loginUrl = process.env.LOGIN_URL || 'https://livepreview.pnefc.net/sso/login';
await page.goto(loginUrl);

  // Handle any cookie banners if present
await acceptCookiesIfPresent(page);
await page.locator('.w-screen > .relative > .absolute').click();

  // Fill in the login form using credentials loaded from the file
await page.getByRole('textbox', { name: 'Email' }).fill(email);
await page.getByRole('textbox', { name: 'Password' }).fill(password);

  // Click the Login button
await page.locator('a').filter({ hasText: 'Login' }).click();

  // Accept cookies again after login if another prompt appears
await page.getByRole('button', { name: 'Accept All Cookies' }).click();
await page.locator('.w-screen > .relative > .absolute').click();

// Click the 'Log In' button
await page.getByRole('button', { name: 'Log In' }).click();

// Verify 'Manage Account' link is visible after login
await expect(page.getByRole('link', { name: 'Manage Account' })).toBeVisible();

// Confirm the page contains the text 'Manage Account'
await expect(page.locator('#page')).toContainText('Manage Account');

// Navigate to the 'Manage Account' section
await page.getByRole('link', { name: 'Manage Account' }).click();

// Accept cookie consent banner
await page.getByRole('button', { name: 'Accept All Cookies' }).click();

// Define common selectors
const firstNameTextbox = page.getByRole('textbox', { name: 'First Name*' });
const lastNameTextbox = page.getByRole('textbox', { name: 'Last Name*' });
const mobilePhoneTextbox = page.getByRole('textbox', { name: 'Mobile Phone Number* GB +' });

//Update the First Name field
await firstNameTextbox.dblclick(); // Select current text
await firstNameTextbox.fill('New Automated Name'); // Fill new first name
  await page.waitForTimeout(1000);

// Update the Last Name field
await lastNameTextbox.dblclick(); // Select current text
await lastNameTextbox.fill('New Automated Last Name'); // Fill new last name
  await page.waitForTimeout(1000);

// Update the mobile phone number
await mobilePhoneTextbox.fill('777777777777'); // Fill new phone number
await page.waitForTimeout(1000);

//Update Address 
async function validateAndFillField(page: Page, label: string, value: string) {
  await expect(page.getByText(label)).toBeVisible();
  await expect(page.getByRole('main')).toContainText(label);
  const field = page.getByRole('textbox', { name: label });
  await field.click();
  await field.fill(value);
}

// Fill address fields with validation
await validateAndFillField(page, 'Address Line 1', 'Automation Address Line 1');
await validateAndFillField(page, 'Address Line 2', 'Automation Address Line 2');
await validateAndFillField(page, 'Address Line 3', 'Automation Address Line 3');
await validateAndFillField(page, 'City / Town', 'London');
await validateAndFillField(page, 'County / Region', 'Lancashire');

//Update Date Of Birth
await page.getByRole('textbox', { name: 'Date of Birth*' }).fill('1969-01-01');

// Submit the form by clicking the "Update Account" link
await page.locator('a').filter({ hasText: 'Update Account' }).click();
await page.waitForTimeout(2000);

// Navigate back to the homepage
await page.goto('https://livepreview.pnefc.net/');
await page.getByRole('button', { name: 'Accept All Cookies' }).click();
await page.getByRole('button', { name: 'Log In' }).click();
  await page.getByRole('link', { name: 'Manage Account' }).click();
  await page.getByRole('button', { name: 'Accept All Cookies' }).click();

// Optional visibility checks (uncomment if needed for validation)
await expect(firstNameTextbox).toBeVisible();
await expect(mobilePhoneTextbox).toBeVisible();
});

test('SSO Flow - Preferences Validation', async ({ browser }) => {
  // Define path to the saved credentials file from the registration test
  const credentialsPath = path.resolve(__dirname, '../tmp/credentials.json');

  // Ensure credentials file exists before proceeding
  if (!fs.existsSync(credentialsPath)) {
    throw new Error('Credentials file not found. Run the registration test first.');
  }

  // Load the email and password from the saved JSON file
  const { email, password } = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));

  // Create a new browser context with basic authentication for the preview environment
  const context = await browser.newContext({
    httpCredentials: {
      username: process.env.PREVIEW_USERNAME || 'urbanzoo',
      password: process.env.PREVIEW_PASSWORD || 'gamechanger1!',
    },
  });

  // Open a new page and navigate to the login URL
  const page = await context.newPage();
  const loginUrl = process.env.LOGIN_URL || 'https://livepreview.pnefc.net/sso/login';
await page.goto(loginUrl);

  // Handle any cookie banners if present
await acceptCookiesIfPresent(page);
await page.locator('.w-screen > .relative > .absolute').click();

  // Fill in the login form using credentials loaded from the file
await page.getByRole('textbox', { name: 'Email' }).fill(email);
await page.getByRole('textbox', { name: 'Password' }).fill(password);

  // Click the Login button
await page.locator('a').filter({ hasText: 'Login' }).click();
await page.getByRole('button', { name: 'Accept All Cookies' }).click();
await page.locator('.w-screen > .relative > .absolute').click();
await page.getByRole('button', { name: 'Log In' }).click();
await page.getByRole('link', { name: 'Manage Account' }).click();
await page.getByRole('button', { name: 'Accept All Cookies' }).click();

// Validate radio buttons are visible and checked
await expect(page.getByRole('radio').first()).toBeVisible();
await expect(page.getByRole('radio').nth(1)).toBeVisible();
await expect(page.getByRole('radio').nth(2)).toBeVisible();

// Validate the Terms & Conditions checkbox is visible and checked
await expect(page.getByRole('checkbox').nth(1)).toBeVisible();

// Validate additional preferences checkboxes
const preferenceCheckboxes = [0, 1, 2, 3];
for (const i of preferenceCheckboxes) {
  const checkbox = page.getByRole('checkbox').nth(2 + i);
  await expect(checkbox).toBeVisible();
}

// Validate communication preferences
const commsSection = page.locator('div').filter({ hasText: /^EmailSMSAutomated phone callsOnline direct messages\?$/ });
await expect(commsSection).toBeVisible();
await expect(commsSection.getByRole('checkbox').nth(1)).toBeChecked();
await expect(commsSection.getByRole('checkbox').nth(2)).toBeChecked();
await expect(commsSection.getByRole('checkbox').nth(3)).toBeChecked();

// Validate agreement box is checked
await expect(page.locator('.flex > div > div:nth-child(4) > div > .flex > .basis-\\[16px\\]')).toBeChecked();

});

test('SSO - View Subscription', async ({ browser }) => {
  // Define path to the saved credentials file from the registration test
  const credentialsPath = path.resolve(__dirname, '../tmp/credentials.json');

  // Ensure credentials file exists before proceeding
  if (!fs.existsSync(credentialsPath)) {
    throw new Error('Credentials file not found. Run the registration test first.');
  }

  // Load the email and password from the saved JSON file
  const { email, password } = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));

  // Create a new browser context with basic authentication for the preview environment
  const context = await browser.newContext({
    httpCredentials: {
      username: process.env.PREVIEW_USERNAME || 'urbanzoo',
      password: process.env.PREVIEW_PASSWORD || 'gamechanger1!',
    },
  });

  // Open a new page and navigate to the login URL
  const page = await context.newPage();
  const loginUrl = process.env.LOGIN_URL || 'https://livepreview.pnefc.net/sso/login';
await page.goto(loginUrl);

  // Handle any cookie banners if present
await acceptCookiesIfPresent(page);
await page.locator('.w-screen > .relative > .absolute').click();

  // Fill in the login form using credentials loaded from the file
await page.getByRole('textbox', { name: 'Email' }).fill(email);
await page.getByRole('textbox', { name: 'Password' }).fill(password);

  // Click the Login button
await page.locator('a').filter({ hasText: 'Login' }).click();

  // Accept cookies again after login if another prompt appears
await page.getByRole('button', { name: 'Accept All Cookies' }).click();
await page.locator('.w-screen > .relative > .absolute').click();

// Click the 'Log In' button
await page.getByRole('button', { name: 'Log In' }).click();
await expect(page.locator('a').filter({ hasText: 'View Subscriptions' })).toBeVisible();
await page.locator('a').filter({ hasText: 'View Subscriptions' }).click();
await expect(page.getByRole('link', { name: 'The logo for the business EFL' })).toBeVisible();
await expect(page.locator('#customer_portal_page_body')).toContainText('EFL Digital - Preston North End Football Club');

});

