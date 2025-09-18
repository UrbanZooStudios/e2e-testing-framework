//npx playwright test "test/CMS/CMS Dashboard Navigation.spec.ts" --headed

import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

test('CMS Homepage Dashboard Navigation', async ({ page }) => {
    
// Navigate to the login page
await page.goto('https://cms.gc.gc2stagingservices.co.uk/');

// Enter email and password for authentication
await page.getByRole('textbox', { name: 'Email * Email *' }).fill("automation@urbanzoo.io");
await page.getByRole('textbox', { name: 'Password * Password *' }).fill('hsP25v9\\\\quT{');

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

test('CMS News Navigation', async ({ page }) => {
    
// Navigate to the login page
await page.goto('https://cms.gc.gc2stagingservices.co.uk/');
  
// Enter email and password for authentication
await page.getByRole('textbox', { name: 'Email * Email *' }).fill("admin@urbanzoo.io");
await page.getByRole('textbox', { name: 'Password * Password *' }).fill("?+C:mL8FD46#'up]4w");

// Click the "Sign in" button
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('link', { name: 'News' }).click();
await page.pause();
});