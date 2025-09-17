//npx playwright test "test/CMS Dashboard Navigation.spec.ts" --headed

import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

// Fetch environment variables for authentication
const email = process.env.PLAYWRIGHT_EMAIL;
const password = process.env.PLAYWRIGHT_PASSWORD;
const testEmail = process.env.PLAYWRIGHT_TEST_EMAIL;
const testPassword = process.env.PLAYWRIGHT_TEST_PASSWORD;

// Validate that the required environment variables are set
if (!email || !password) {
  throw new Error("Main login Email or Password is not set in environment variables.");
}
if (!testEmail || !testPassword) {
  throw new Error("Test Email or Test Password is not set in environment variables.");
}

test('CSM Dashboard Navigation', async ({ page }) => {
    
    // Navigate to the login page
    //await page.goto('https://cms.gc.uzgc2.com/login');
    await page.goto('https://cms.gc.gc2stagingservices.co.uk/');

    // Enter email and password for authentication
    await page.getByRole('textbox', { name: 'Email * Email *' }).fill(email);
    await page.getByRole('textbox', { name: 'Password * Password *' }).fill("?+C:mL8FD46#'up]4w");
    // Click the "Sign in" button
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Verify that the navigation bar and logo are visible after login
    await expect(page.getByRole('navigation').getByRole('img')).toBeVisible();

    // Verify the presence of key navigation links on the dashboard
// Verify 'Dashboard' link is visible in the navigation/menu
await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();

// Verify 'News' link is visible
await expect(page.getByRole('link', { name: 'News' })).toBeVisible();

// Verify 'Pages' link is visible
await expect(page.getByRole('link', { name: 'Pages' })).toBeVisible();

// Verify 'Team Management' link is visible
await expect(page.getByRole('link', { name: 'Team Management' })).toBeVisible();

// Verify 'Calendar' link is visible
await expect(page.getByRole('link', { name: 'Calendar' })).toBeVisible();

// Verify 'Forms' link is visible
await expect(page.getByRole('link', { name: 'Forms' })).toBeVisible();

// Verify 'Streamline/Videos' link is visible
await expect(page.getByRole('link', { name: 'Streamline/Videos' })).toBeVisible();

// Verify 'Media' link is visible
await expect(page.getByRole('link', { name: 'Media' })).toBeVisible();

// Verify 'Overlay Promos' link is visible
await expect(page.getByRole('link', { name: 'Overlay Promos' })).toBeVisible();

// Verify 'Advertising' link is visible
await expect(page.getByRole('link', { name: 'Advertising' })).toBeVisible();

// Verify 'Sponsors' link is visible
await expect(page.getByRole('link', { name: 'Sponsors' })).toBeVisible();

// Verify 'App Content Feed' link is visible
await expect(page.getByRole('link', { name: 'App Content Feed' })).toBeVisible();

// Verify 'Website Manager' link is visible
await expect(page.getByRole('link', { name: 'Website Manager' })).toBeVisible();

// Verify 'Settings Manager' link is visible
await expect(page.getByRole('link', { name: 'Settings Manager' })).toBeVisible();

// Verify 'User Management' link is visible
await expect(page.getByRole('link', { name: 'User Management' })).toBeVisible();

// Verify 'My Profile' link is visible
await expect(page.getByRole('link', { name: 'My Profile' })).toBeVisible();

// Verify 'Admin Users' link is visible
await expect(page.getByRole('link', { name: 'Admin Users' })).toBeVisible();

    // Verify that the "Logout" button is present
    await expect(page.locator('div').filter({ hasText: /^Logout$/ })).toBeVisible();

    // Click on the "Logout" button to sign out
    await page.getByRole('button', { name: 'Logout' }).click();
});
