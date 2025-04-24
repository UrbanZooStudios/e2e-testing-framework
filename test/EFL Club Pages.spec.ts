import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();


// Fetch environment variables
const email = process.env.EFL_EMAIL;
const password = process.env.EFL_PASSWORD;
const testEmail = process.env.PLAYWRIGHT_TEST_EMAIL;
const testPassword = process.env.PLAYWRIGHT_TEST_PASSWORD;
const httpUsername = process.env.HTTP_USERNAME;
const httpPassword = process.env.HTTP_PASSWORD;
const adminemail = process.env.EFL_ADMIN_EMAIL;
const adminpassword = process.env.EFL_ADMIN_PASSWORD;

// Validate environment variables
if (!email || !password) {
  throw new Error("Main login Email or Password is not set in environment variables.");
}
if (!testEmail || !testPassword) {
  throw new Error("Test Email or Test Password is not set in environment variables.");
}

// Test case: Valid login to CMS
test('CMS Valid Login', async ({ page }) => {
    // Navigate to the CMS login page
    await page.goto('https://gc-admin.gc.eflservices.co.uk/login');
    
    // Fill in valid email and password fields
    await page.getByRole('textbox', { name: 'Email *' }).fill(email);
    await page.getByRole('textbox', { name: 'Password *' }).fill(password);
    
    // Submit the login form by clicking the Login button
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Close the welcome modal or message if it appears
    await page.getByText('close', { exact: true }).click();
    
    // Assert that the main content area is visible (indicating successful login)
    await expect(page.locator('.v-responsive__content').first()).toBeVisible();
    
    // Verify that the Dashboard is part of the sidebar or complementary content
    await expect(page.getByRole('complementary')).toContainText('Dashboard');
    
    // Log out from the CMS
    await page.getByRole('button', { name: 'Logout' }).click();
    
    // Confirm that the login screen is displayed again
    await expect(
      page.locator('#gamechanger div').filter({ hasText: 'Email *Password *Forgotten' }).nth(4)
    ).toBeVisible();
  });
  
  // Test case: Invalid login to CMS
  test('CMS Invalid Login', async ({ page }) => {
    // Navigate to the CMS login page
    await page.goto('https://gc-admin.gc.eflservices.co.uk/');
    
    // Fill in incorrect email and password fields
    await page.getByRole('textbox', { name: 'Email *' }).fill(testEmail);
    await page.getByRole('textbox', { name: 'Password *' }).fill(testPassword);
    
    // Attempt to log in with invalid credentials
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Validate that an error message is displayed for incorrect login
    await expect(page.getByText('warningIncorrect username or')).toBeVisible();
    await expect(page.locator('#gamechanger')).toContainText('Incorrect username or password.');
    
    // Ensure the warning message appears again (possibly redundant)
    await expect(page.getByText('warningIncorrect username or')).toBeVisible();
  });

// Test case: Valid login to LivePreview Website
test('Live Preview Valid Login', async ({ browser }) => {
    // Create a browser context using HTTP Basic Auth credentials
    const context = await browser.newContext({
      httpCredentials: {
        username: 'urbanzoo',         // Ideally should be from env
        password: 'gamechanger1!',    // Ideally should be from env
      },
    });
  
   // Open a new page using the authenticated context
   const page = await context.newPage();
  
   // Navigate to the Live Preview clubs login page
   await page.goto('https://livepreview.efl.com/clubs/');
 
   // Accept cookies if the banner appears
   const acceptCookies = page.getByRole('button', { name: 'Accept All Cookies' });
   if (await acceptCookies.isVisible()) {
     await acceptCookies.click();
   }
 
   // Close the promotional overlay popup if displayed
   const promoClose = page.locator('.overlay-promo__close-button');
   if (await promoClose.isVisible()) {
     await promoClose.click();
   }
 
   // Log in with valid credentials (from env)
   await expect(page.getByRole('heading', { name: 'Sign in to your club account' })).toBeVisible();
   await page.getByRole('textbox', { name: 'email' }).fill(email);
   await page.getByRole('textbox', { name: 'password' }).fill(password);
   await page.getByRole('button', { name: 'Log In' }).click();
  
    // Check the visibility and correctness of the login button
    await expect(page.getByRole('button', { name: 'Log In' })).toBeVisible();
    await expect(page.getByRole('main')).toContainText('Log In');
  
    // Click the login button to submit the form
    await page.getByRole('button', { name: 'Log In' }).click();
  
    // Post-login validation — check for key elements that confirm successful login
    await expect(page.getByText('Club Details Log Out')).toBeVisible(); // Confirms user is logged in
    await expect(page.getByRole('button', { name: 'Log Out' })).toBeVisible(); // Confirms logout button is present
    await expect(page.getByRole('main')).toContainText('Log Out'); // Cross-check in main region
  
    // Verify that expected content (e.g., league name) is shown on the page
    await expect(page.getByRole('heading', { name: 'Championship' })).toBeVisible();
    await expect(page.getByRole('main')).toContainText('Championship');
  });

// Test case: Invalid login to LivePreview Website
test('Live Preview Invalid Login', async ({ browser }) => {
    // Create a browser context using HTTP Basic Auth credentials
    const context = await browser.newContext({
      httpCredentials: {
        username: 'urbanzoo',         // Ideally should be stored in environment variables
        password: 'gamechanger1!',    // Ideally should be stored in environment variables
      },
    });
  
    // Open a new page using the authenticated context
    const page = await context.newPage();
  
    // Navigate to the Live Preview clubs login page
    await page.goto('https://livepreview.efl.com/clubs/');
  
    // Accept cookies if the banner appears
    const acceptCookies = page.getByRole('button', { name: 'Accept All Cookies' });
    if (await acceptCookies.isVisible()) {
      await acceptCookies.click();
    }
  
    // Close the promotional overlay popup if displayed
    const promoClose = page.locator('.overlay-promo__close-button');
    if (await promoClose.isVisible()) {
      await promoClose.click();
    }
  
    // Log in with valid credentials (from env)
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.getByRole('textbox', { name: 'email' }).fill(testEmail);
  
    // Fill in the password field with an invalid password
    await page.getByRole('textbox', { name: 'password' }).fill(testPassword);
  
    // Attempt to log in using invalid credentials
    await page.getByRole('button', { name: 'Log In' }).click();
  
    // Validate that an error message appears due to incorrect credentials
    await expect(page.getByText('Incorrect username or')).toBeVisible();
  
    // Assert the full error message is also visible within the main page content
    await expect(page.getByRole('main')).toContainText('Incorrect username or password.');
  });

test('Live Preview Championship UI Design', async ({ browser }) => {
    // Create a browser context using HTTP Basic Auth credentials from env
    const context = await browser.newContext({
      httpCredentials: {
        username: 'urbanzoo',         // Ideally should be stored in environment variables
        password: 'gamechanger1!',    // Ideally should be stored in environment variables
      },
    });
  
    // Open a new page using the authenticated context
    const page = await context.newPage();
  
    // Navigate to the Live Preview clubs login page
    await page.goto('https://livepreview.efl.com/clubs/');
  
    // Accept cookies if the banner appears
    const acceptCookies = page.getByRole('button', { name: 'Accept All Cookies' });
    if (await acceptCookies.isVisible()) {
      await acceptCookies.click();
    }
  
    // Close the promotional overlay popup if displayed
    const promoClose = page.locator('.overlay-promo__close-button');
    if (await promoClose.isVisible()) {
      await promoClose.click();
    }
  
    // Log in with valid credentials (from env)
    await expect(page.getByRole('heading', { name: 'Sign in to your club account' })).toBeVisible();
    await page.getByRole('textbox', { name: 'email' }).fill(email);
    await page.getByRole('textbox', { name: 'password' }).fill(password);
    await page.getByRole('button', { name: 'Log In' }).click();
  
    // Wait for club element to load (e.g., Blackburn Rovers)
    const clubButton = page.getByText('Blackburn Rovers', { exact: true });
    await expect(clubButton).toBeVisible();
    await clubButton.click();
  
    // Wait for the header to load and select the styled element
    const header = page.locator('.club-header-championship');
    await expect(header).toBeVisible();
  
    // Get the computed background-image style
    const backgroundImage = await header.evaluate((el) =>
      window.getComputedStyle(el).getPropertyValue('background-image')
    );
  
    // Log it (for debugging)
    console.log('Background Image:', backgroundImage);
  
    // Assert that it contains the expected gradient values
    expect(backgroundImage).toContain('linear-gradient');
    expect(backgroundImage).toContain('rgb(179, 156, 81)');
    expect(backgroundImage).toContain('rgb(235, 214, 148)');
  });

test('Live Preview League One UI Design', async ({ browser }) => {
    // Create a browser context using HTTP Basic Auth credentials from env
    const context = await browser.newContext({
      httpCredentials: {
        username: 'urbanzoo',         // Ideally should be stored in environment variables
        password: 'gamechanger1!',    // Ideally should be stored in environment variables
      },
    });
  
    // Open a new page using the authenticated context
    const page = await context.newPage();
  
    // Navigate to the Live Preview clubs login page
    await page.goto('https://livepreview.efl.com/clubs/');
  
    // Accept cookies if the banner appears
    const acceptCookies = page.getByRole('button', { name: 'Accept All Cookies' });
    if (await acceptCookies.isVisible()) {
      await acceptCookies.click();
    }
  
    // Close the promotional overlay popup if displayed
    const promoClose = page.locator('.overlay-promo__close-button');
    if (await promoClose.isVisible()) {
      await promoClose.click();
    }
  
    // Log in with valid credentials (from env)
    await expect(page.getByRole('heading', { name: 'Sign in to your club account' })).toBeVisible();
    await page.getByRole('textbox', { name: 'email' }).fill(email);
    await page.getByRole('textbox', { name: 'password' }).fill(password);
    await page.getByRole('button', { name: 'Log In' }).click();

// Ensure club button loads
const clubButton = page.getByText('Barnsley', { exact: true });
await clubButton.waitFor({ state: 'visible', timeout: 15000 });
await clubButton.click();

// Ensure header loads without dynamic attribute
const header = page.locator('.club-header-leagueOne');
await header.waitFor({ state: 'visible', timeout: 15000 });

// Evaluate style after visibility confirmed
const backgroundImage = await header.evaluate((el) =>
  window.getComputedStyle(el).getPropertyValue('background-image')
);

console.log('Background Image:', backgroundImage);

expect(backgroundImage).toContain('linear-gradient');
expect(backgroundImage).toContain('rgb(181, 181, 181)');
expect(backgroundImage).toContain('rgb(218, 231, 231)');
});

test('Live Preview League Two UI Design', async ({ browser }) => {
    // Create a browser context using HTTP Basic Auth credentials from env
    const context = await browser.newContext({
      httpCredentials: {
        username: 'urbanzoo',         // Ideally should be stored in environment variables
        password: 'gamechanger1!',    // Ideally should be stored in environment variables
      },
    });
  
    // Open a new page using the authenticated context
    const page = await context.newPage();
  
    // Navigate to the Live Preview clubs login page
    await page.goto('https://livepreview.efl.com/clubs/');
  
    // Accept cookies if the banner appears
    const acceptCookies = page.getByRole('button', { name: 'Accept All Cookies' });
    if (await acceptCookies.isVisible()) {
      await acceptCookies.click();
    }
  
    // Close the promotional overlay popup if displayed
    const promoClose = page.locator('.overlay-promo__close-button');
    if (await promoClose.isVisible()) {
      await promoClose.click();
    }
  
    // Log in with valid credentials (from env)
    await expect(page.getByRole('heading', { name: 'Sign in to your club account' })).toBeVisible();
    await page.getByRole('textbox', { name: 'email' }).fill(email);
    await page.getByRole('textbox', { name: 'password' }).fill(password);
    await page.getByRole('button', { name: 'Log In' }).click();

// Ensure club button loads
const clubButton = page.getByText('Accrington Stanley', { exact: true });
await clubButton.waitFor({ state: 'visible', timeout: 15000 });
await clubButton.click();

// Ensure header loads without dynamic attribute
const header = page.locator('.club-header-leagueTwo');
await header.waitFor({ state: 'visible', timeout: 15000 });

// Evaluate style after visibility confirmed
const backgroundImage = await header.evaluate((el) =>
  window.getComputedStyle(el).getPropertyValue('background-image')
);

console.log('Background Image:', backgroundImage);

// Assert that it contains the expected gradient values
expect(backgroundImage).toContain('linear-gradient');
expect(backgroundImage).toContain('rgb(187, 12, 47)');
expect(backgroundImage).toContain('rgb(255, 84, 84)');
});

test('CMS Club Creation', async ({ page }) => {
// Navigate to the CMS login page
await page.goto('https://gc-admin.gc.eflservices.co.uk/');
    
// Fill in valid email and password fields
await page.getByRole('textbox', { name: 'Email *' }).fill(email);
await page.getByRole('textbox', { name: 'Password *' }).fill(password);
    
// Submit the login form by clicking the Login button
await page.getByRole('button', { name: 'Login' }).click();
    
// Close the welcome modal or message if it appears
await page.getByText('close', { exact: true }).click();
    
// Assert that the main content area is visible (indicating successful login)
await expect(page.locator('.v-responsive__content').first()).toBeVisible();
    
// Verify that the Dashboard is part of the sidebar or complementary content
await expect(page.getByRole('complementary')).toContainText('Dashboard');

// Click on the 'Clubs' link to navigate to the Clubs page
await page.getByRole('link', { name: 'Clubs' }).click();

// Verify that the 'Add Clubs' button is visible on the page
await expect(page.getByRole('button', { name: 'Add Clubs' })).toBeVisible();

// Confirm that the 'gamechanger' element contains the expected text indicating "Add Clubs" section
await expect(page.locator('#gamechanger')).toContainText('add Add Clubs');

// Ensure the "Create Club Page" text is visible, indicating we're on the correct form/page
await page.getByRole('button', { name: 'Add Clubs' }).click();

// Verify that the word "club" is visible on the page (exact match)
await expect(page.getByText('club', { exact: true })).toBeVisible();

// Check for the presence of the full label text for the form fields
await expect(page.getByText('club Hide club Club Name *')).toBeVisible();

// Ensure the 'Hide club' label/text is visible (likely tied to a checkbox)
await expect(page.getByText('Hide club')).toBeVisible();

// Verify that the checkbox (probably for hiding the club) is visible
await expect(page.getByRole('checkbox')).toBeVisible();

// Ensure the form contains the label 'Hide club'
await expect(page.locator('form')).toContainText('Hide club');

// Ensure the form contains the label 'Club Name *' (indicating a required field)
await expect(page.locator('form')).toContainText('Club Name *');

// Confirm the input field for club name is visible
await expect(page.locator('.v-text-field__slot > input').first()).toBeVisible();

// Focus (click) on the first input field in the form
await page.locator('.v-text-field__slot > input').first().click();

// Fill in the club name field with the name 'UrbanZoo FC'
await page.locator('.v-text-field__slot > input').first().fill('UrbanZoo FC');

// Ensure the label or heading 'Main Number' is visible on the page
await expect(page.getByText('Main Number')).toBeVisible();

// Check that the form contains the text 'Main Number'
await expect(page.locator('form')).toContainText('Main Number');

// Double-click on the input field for 'Main Number' to focus/select it
await page.locator('div:nth-child(3) > div > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').dblclick();

// Fill the 'Main Number' input field with the specified phone number
await page.locator('div:nth-child(3) > div > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').fill('0844 330 1443');

// Ensure the label or heading 'Ticket Office Number (' is visible (likely part of a longer string)
await expect(page.getByText('Ticket Office Number (')).toBeVisible();

// Check that the form contains the full string 'Ticket Office Number (recommended)'
await expect(page.locator('form')).toContainText('Ticket Office Number (recommended)');

// Double-click on the input field for 'Ticket Office Number' to focus/select it
await page.locator('div:nth-child(4) > div > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').dblclick();

// Fill in the 'Ticket Office Number' field with the phone number
await page.locator('div:nth-child(4) > div > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').fill('0844 330 1000');

// Double-click on the email input field to focus or select existing content
await page.locator('input[type="email"]').dblclick();

// Fill in the email input field with the club's contact email
await page.locator('input[type="email"]').fill('gamechanger@urbanzoo.io');

// Verify that the 'Club Website (recommended)' text is visible
await expect(page.getByText('Club Website (recommended)')).toBeVisible();

// Ensure the form contains the label/text for the club website field
await expect(page.locator('form')).toContainText('Club Website (recommended)');

// Click and focus on the website URL input field
await page.locator('input[type="url"]').click();
await page.locator('input[type="url"]').dblclick();

// Fill in the website field with the club's URL
await page.locator('input[type="url"]').fill('https://urbanzoo.io/');

// Verify that the heading 'Club Crest Image' is visible on the page
await expect(page.getByRole('heading', { name: 'Club Crest Image' })).toBeVisible();

// Click on the image library to open the image selection modal/interface
await page.locator('.image-editor__image-library').first().click();

// Focus on the search textbox inside the image library
await page.getByRole('textbox', { name: 'Search the library' }).dblclick();

// Enter the search term 'logo' into the image library search field
await page.getByRole('textbox', { name: 'Search the library' }).fill('logo');

// Press 'Enter' to execute the search
await page.getByRole('textbox', { name: 'Search the library' }).press('Enter');

// Click the 'Search' button to confirm and execute the image search
await page.getByRole('button', { name: 'Search' }).click();

// From the search results, select the button to choose the image named 'Urban Zoo Logo.png'
await page.getByRole('article').filter({ hasText: 'radio_button_uncheckedmore_horizstar_outlineUrban Zoo Logo.png' }).getByRole('button').first().click();

// Click the 'Add' button to attach the selected logo image
await page.getByRole('button', { name: 'Add', exact: true }).click();

// Verify that the logo image has been successfully added and is visible
await expect(page.getByRole('img')).toBeVisible();

// Ensure the 'Competitions *' label is visible, confirming we're on the right section
await expect(page.getByText('Competitions *')).toBeVisible();
await expect(page.locator('#gamechanger')).toContainText('Competitions *');

// Open the competitions dropdown selector
await page.locator('.layout > div > .v-input > .v-input__control > .v-input__slot > .v-select__slot > .v-select__selections').click();

// Select 'English Football League - Championship' from the dropdown options
await page.locator('a').filter({ hasText: 'English Football League - Championship' }).click();

// Verify that the 'Squad Page (recommended)' label is present
await expect(page.getByText('Squad Page (recommended)')).toBeVisible();

// Confirm that the input for 'Squad Page' URL is visible
await expect(page.locator('div:nth-child(9) > div > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input')).toBeVisible();

// Focus on the 'Squad Page' URL input field
await page.locator('div:nth-child(9) > div > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').click();

// Fill in the URL for the 'Squad Page'
await page.locator('div:nth-child(9) > div > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').fill('https://urbanzoo.io/');

// Verify that the 'Fixtures And Results' label is present (possibly truncated)
await expect(page.getByText('Fixtures And Results (')).toBeVisible();
await expect(page.locator('#gamechanger')).toContainText('Fixtures And Results (recommended)');

// Focus and fill in the 'Fixtures And Results' URL input field
await page.locator('div:nth-child(10) > div > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').dblclick();
await page.locator('div:nth-child(10) > div > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').fill('https://urbanzoo.io/');

// Verify visibility of the 'Football Club Trading Name' label
await expect(page.getByText('Football Club Trading Name (')).toBeVisible();
await expect(page.locator('#gamechanger')).toContainText('Football Club Trading Name (recommended)');

// Focus on the 'Trading Name' input field and fill it
await page.locator('div:nth-child(11) > div > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').click();
await page.locator('div:nth-child(11) > div > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').fill('https://urbanzoo.io/');

// Confirm visibility of the 'Company Registration Number' section
await expect(page.getByText('Company Registration Number')).toBeVisible();
await expect(page.locator('#gamechanger')).toContainText('Company Registration Number');


// Click on the input field for the club registration number
await page.locator('div:nth-child(12) > div > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').click();
// Fill in the club registration number
await page.locator('div:nth-child(12) > div > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').fill('123456test');

// Click on the address input field
await page.locator('div:nth-child(13) > div > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').click();
// Select any existing text in the address field
await page.locator('div:nth-child(13) > div > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').dblclick();
// Fill in the club address
await page.locator('div:nth-child(13) > div > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').fill('The Base, Dallam Ln, Warrington WA2 7NG');

// Focus on the textarea (likely for director info)
await page.locator('textarea').click();
// Verify the 'Directors' section is visible
await expect(page.getByText('Directors')).toBeVisible();
await expect(page.locator('#gamechanger')).toContainText('Directors');

// Fill in director name or notes
await page.locator('textarea').click();
await page.locator('textarea').fill('Test Director');
// Double-click to select text (optional UX step)
await page.getByText('Directors').dblclick();
await page.locator('textarea').dblclick();
// Re-fill just in case to ensure correct value
await page.locator('textarea').fill('Test Director');

// Check for visibility of 'Club contacts' section
await expect(page.locator('#gamechanger')).toContainText('Club contacts');
await expect(page.getByText('Club contacts')).toBeVisible();

// Ensure 'Add contact' button is present and click it
await expect(page.getByRole('button', { name: 'Add contact' })).toBeVisible();
await expect(page.locator('#gamechanger')).toContainText('Add contact');
await page.getByRole('button', { name: 'Add contact' }).click();

// Validate that required contact fields are visible
await expect(page.getByText('Name', { exact: true })).toBeVisible();
await expect(page.getByText('open_with Name Email address')).toBeVisible();
await expect(page.getByText('Name', { exact: true })).toBeVisible();
await expect(page.locator('#gamechanger')).toContainText('Name');
await expect(page.getByText('Email address', { exact: true })).toBeVisible();
await expect(page.locator('#gamechanger')).toContainText('Email address');
await expect(page.getByText('Position', { exact: true })).toBeVisible();
await expect(page.locator('#gamechanger')).toContainText('Position');
await expect(page.getByText('Phone number')).toBeVisible();
await expect(page.locator('#gamechanger')).toContainText('Phone number');

// Fill in contact name
await page.locator('.flex > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').first().dblclick();
await page.locator('.flex > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').first().fill('Test Contact');
// Press Tab to navigate to the next field
await page.locator('.flex > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').first().press('Tab');

// Fill in contact email address
await page.locator('div:nth-child(3) > .layout > .flex > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').fill('gamechanger@urbanzoo.io');

// Fill in contact position
await page.locator('div:nth-child(4) > .layout > .flex > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').click();
await page.locator('div:nth-child(4) > .layout > .flex > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').fill('Director');
// Press Tab to move to phone number field
await page.locator('div:nth-child(4) > .layout > .flex > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').press('Tab');

// Fill in contact phone number
await page.locator('div:nth-child(5) > .layout > .flex > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').fill('123456789');

// Validate that the "Home Kit" form section is visible
await expect(page.getByText('kits Home Kit Shirt Text')).toBeVisible();
await expect(page.locator('.section-container > div > .label').first()).toBeVisible();

// Fill in Home Kit Shirt Text
await page.locator('.layout > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').first().click();
await page.locator('.layout > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').first().fill('Blue & White');

// Fill in Home Kit Shorts Text
await expect(page.locator('.section-container > div:nth-child(2) > .label').first()).toBeVisible();
await page.locator('.section-container > div:nth-child(2) > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').first().click();
await page.locator('.section-container > div:nth-child(2) > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').first().fill('Blue & White');

// Fill in Home Kit Socks Text
await expect(page.locator('.section-container > div:nth-child(3) > .label').first()).toBeVisible();
await page.locator('div:nth-child(3) > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').first().dblclick();
await page.locator('div:nth-child(3) > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').first().fill('Blue & White');

// Upload Home Kit Image
await expect(page.locator('div:nth-child(4) > div > .flex').first()).toBeVisible();
await expect(page.locator('.image-editor__image-library').first()).toBeVisible();
await page.locator('.layout > div > .flex > .image-editor__image-wrap > .image-editor__actions > .v-dialog__container > .v-dialog__activator > .image-editor__image-library').first().click();

// Search and select kit image
await page.getByRole('textbox', { name: 'Search the library' }).click();
await page.getByRole('textbox', { name: 'Search the library' }).fill('screenshot');
await page.getByRole('textbox', { name: 'Search the library' }).press('Enter');
await page.getByRole('button', { name: 'Search' }).click();
await page.getByRole('article').filter({ hasText: 'Screenshot 2025-04-11 at 15.51.44.' }).getByRole('button').first().click();
await page.getByRole('button', { name: 'Add', exact: true }).click();

// Repeat the same process for Away Kit
// Validate section and fill in text fields
await expect(page.getByText('Away Kit', { exact: true })).toBeVisible();
await expect(page.locator('#gamechanger')).toContainText('Away Kit');
await expect(page.locator('#gamechanger')).toContainText('Shirt Text');
// Fill Shirt, Shorts, Socks Text for Away Kit
// Upload image for Away Kit
// Repeat above steps...

// Repeat for Third Kit and Goalkeeper Home Kit
// Each kit includes: Shirt Text, Shorts Text, Socks Text, Kit Image upload

// Add document details
await expect(page.getByText('documents', { exact: true })).toBeVisible();
await expect(page.getByRole('button', { name: 'Add document' })).toBeVisible();
await page.getByRole('button', { name: 'Add document' }).click();
await page.getByRole('button', { name: 'Save' }).click();
await expect(page.getByText('Required.').first()).toBeVisible();
await expect(page.getByText('Required.').nth(1)).toBeVisible();
await expect(page.getByText('Certain entries are invalid')).toBeVisible();
await expect(page.locator('footer')).toContainText('Certain entries are invalid or required');
await expect(page.getByText('Document name')).toBeVisible();
await expect(page.getByText('Document URL')).toBeVisible();
await page.locator('.flex > div > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').first().fill('Document Test');
await page.locator('.flex > div:nth-child(3) > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').fill('test.com');

// Add stadium details
await expect(page.getByText('stadium', { exact: true })).toBeVisible();
await expect(page.locator('#gamechanger')).toContainText('Add stadium');

// Click on 'Add stadium' button
await page.getByRole('button', { name: 'Add stadium' }).click();

// Fill in 'Team Name'
await expect(page.getByText('Team Name')).toBeVisible();
await page.locator('.flex > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').first().fill('Urban Zoo');

// Fill in 'Stadium Name' using improved locator
await page.locator('.flex > div > div > div > div > div > .layout > .flex > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').first().click();
await page.locator('.flex > div > div > div > div > div > .layout > .flex > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').first().dblclick();
await page.locator('.flex > div > div > div > div > div > .layout > .flex > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').first().fill('The Base');

// Fill in 'Stadium Name'
await expect(page.getByText('Stadium address')).toBeVisible();
await page.locator('.flex > div > div > div > div > div:nth-child(3) > .layout > .flex > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').click();
await page.locator('.flex > div > div > div > div > div:nth-child(3) > .layout > .flex > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').dblclick();
await page.locator('.flex > div > div > div > div > div:nth-child(3) > .layout > .flex > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').fill('Warrington Base');

// Fill in 'Stadium Address'
await expect(page.getByText('Stadium address')).toBeVisible();
await expect(page.locator('#gamechanger')).toContainText('Stadium address');
await page.locator('.flex > div > div > div > div > div:nth-child(4) > .layout > .flex > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').dblclick();
await page.locator('.flex > div > div > div > div > div:nth-child(4) > .layout > .flex > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').fill('Warrington Base');

//Fill in Stadium Capacity
await expect(page.getByText('Stadium capacity')).toBeVisible();
await expect(page.locator('#gamechanger')).toContainText('Stadium capacity');
await page.locator('.flex > div > div > div > div > div:nth-child(5) > .layout > .flex > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').click();
await page.locator('.flex > div > div > div > div > div:nth-child(5) > .layout > .flex > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').fill('31000');

//Fill in Pitch Dimensions
await expect(page.getByText('Pitch dimensions')).toBeVisible();
await expect(page.locator('#gamechanger')).toContainText('Pitch dimensions');
await page.locator('div:nth-child(6) > .layout > .flex > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').click();
await page.locator('div:nth-child(6) > .layout > .flex > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input').fill('105x68');

// Save form
await page.getByRole('button', { name: 'Save' }).click();

//Club Information
await expect(page.getByRole('cell', { name: 'UrbanZoo FC' })).toBeVisible();
await expect(page.getByRole('table')).toContainText('UrbanZoo FC');
await expect(page.getByRole('row', { name: 'UrbanZoo FC English Football' }).locator('div').first()).toBeVisible();
await expect(page.getByRole('table')).toContainText('English Football League - Championship');
});

test('CMS Hide Club Creation', async ({ page }) => {
// Navigate to the CMS login page
await page.goto('https://gc-admin.gc.eflservices.co.uk/');
        
// Fill in valid email and password fields
await page.getByRole('textbox', { name: 'Email *' }).fill(email);
await page.getByRole('textbox', { name: 'Password *' }).fill(password);
        
// Submit the login form by clicking the Login button
await page.getByRole('button', { name: 'Login' }).click();
        
// Close the welcome modal or message if it appears
await page.getByText('close', { exact: true }).click();

await page.getByRole('link', { name: 'Clubs' }).click();

await page.getByRole('row', { name: /UrbanZoo FC English Football/i }).locator('i').first().click();

const toggle = page.locator('input[type="switch"]');
const ripple = page.locator('.v-input--selection-controls__ripple');

// Click only if it's currently off
const isChecked = await toggle.getAttribute('aria-checked');

if (isChecked === 'false') {
  await ripple.click();
  // Wait for it to be toggled on
  await expect(toggle).toHaveAttribute('aria-checked', 'true');
}
await page.getByRole('button', { name: 'Save' }).click();
await page.getByText('sports_soccerClubs').click();

});

test('Live Preview UrbanZoo FC', async ({ browser }) => {
    // Create a browser context using HTTP Basic Auth credentials from env
    const context = await browser.newContext({
      httpCredentials: {
        username: 'urbanzoo',         // Ideally should be stored in environment variables
        password: 'gamechanger1!',    // Ideally should be stored in environment variables
      },
    });
  
    // Open a new page using the authenticated context
    const page = await context.newPage();
  
    // Navigate to the Live Preview clubs login page
    await page.goto('https://livepreview.efl.com/clubs/');
  
    // Accept cookies if the banner appears
    const acceptCookies = page.getByRole('button', { name: 'Accept All Cookies' });
    if (await acceptCookies.isVisible()) {
      await acceptCookies.click();
    }
  
    // Close the promotional overlay popup if displayed
    const promoClose = page.locator('.overlay-promo__close-button');
    if (await promoClose.isVisible()) {
      await promoClose.click();
    }
  
    // Log in with valid credentials (from env)
    await expect(page.getByRole('heading', { name: 'Sign in to your club account' })).toBeVisible();
    await page.getByRole('textbox', { name: 'email' }).fill(email);
    await page.getByRole('textbox', { name: 'password' }).fill(password);
    await page.getByRole('button', { name: 'Log In' }).click();

// Wait for club element to load (e.g., UrbanZoo FC)
const clubButton = page.getByText('UrbanZoo FC', { exact: true });
await page.waitForTimeout(1000);
await expect(clubButton).toBeVisible();
await clubButton.click();
});

test('CMS Club User Management', async ({ page }) => {
  // Navigate to the CMS login page
  await page.goto('https://gc-admin.gc.urbanzoofc.com/');
          
  if (!adminemail || !adminpassword) {
    throw new Error("Admin email or password is not defined. Check your environment variables.");
  }
  
  await page.getByRole('textbox', { name: 'Email *' }).fill(adminemail);
  await page.getByRole('textbox', { name: 'Password *' }).fill(adminpassword);

  // Submit the login form by clicking the Login button
  await page.getByRole('button', { name: 'Login' }).click();
          
  // Close the welcome modal or message if it appears
  await page.getByText('close', { exact: true }).click();
  
  //Selec Club Users section
  await page.getByRole('link', { name: 'Club Users' }).click();

// Verify that the user search field is rendered correctly with expected labels/text
await expect(page.getByText('Field to searchEmailarrow_drop_downStarts with: Search Users')).toBeVisible();

// Double-check that the same text is present in the DOM container with ID 'gamechanger'
await expect(page.locator('#gamechanger')).toContainText('Field to searchEmailarrow_drop_downStarts with: Search Users');

// Click on the "Starts with" search textbox to focus it
await page.getByRole('textbox', { name: 'Starts with:' }).click();

// Enter 'thomas' into the search textbox to filter/search for users
await page.getByRole('textbox', { name: 'Starts with:' }).fill('thomas');

// Expect that a user email containing 'thomas' appears in the search results
await expect(page.getByText('thomasastley@urbanzoo.io')).toBeVisible();

// Also ensure the email is present within the DOM element with ID 'gamechanger'
await expect(page.locator('#gamechanger')).toContainText('thomasastley@urbanzoo.io');

// ✏️ Clear the search textbox by clicking and filling it with an empty string
await page.getByRole('textbox', { name: 'Starts with:' }).click();
await page.getByRole('textbox', { name: 'Starts with:' }).fill('');


});