//npx playwright test "test/CMS/CSM Dashboard Navigation.spec.ts" --headed

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
    await page.goto('https://cms.gc.uzstaging1.co.uk/login');

    // Enter email and password for authentication
    await page.getByRole('textbox', { name: 'Email * Email *' }).fill(email);
    await page.getByRole('textbox', { name: 'Password * Password *' }).fill(password);

    // Click the "Sign in" button
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Verify that the navigation bar and logo are visible after login
    await expect(page.getByRole('navigation').getByRole('img')).toBeVisible();

    // Verify the presence of key navigation links on the dashboard
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'News' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Pages' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Team Management' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Calendar' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Forms' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Streamline/Videos' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Media' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Overlay Promos' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Advertising' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sponsors' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'App Content Feed' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Website Manager' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Settings Manager' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'User Management' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'My Profile' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Admin Users' })).toBeVisible();

    // Verify that the "Logout" button is present
    await expect(page.locator('div').filter({ hasText: /^Logout$/ })).toBeVisible();

    // Ensure that the welcome message and admin greeting text appear correctly
    await expect(page.locator('body')).toContainText('Welcome to Gamechanger for UZGC 2');
    await expect(page.locator('h1')).toContainText('Hi, Admin');

    // Click on the "Logout" button to sign out
    await page.getByRole('button', { name: 'Logout' }).click();
});
