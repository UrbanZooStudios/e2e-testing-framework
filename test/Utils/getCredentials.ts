import * as dotenv from 'dotenv';
dotenv.config();

console.log("Loaded ENV:", {
  email: process.env.PLAYWRIGHT_EMAIL,
  password: process.env.PLAYWRIGHT_PASSWORD,
  testEmail: process.env.PLAYWRIGHT_TEST_EMAIL,
  testPassword: process.env.PLAYWRIGHT_TEST_PASSWORD,
});

export function getCredentials() {
  const email = process.env.PLAYWRIGHT_EMAIL;
  const password = process.env.PLAYWRIGHT_PASSWORD;
  const testEmail = process.env.PLAYWRIGHT_TEST_EMAIL || email;
  const testPassword = process.env.PLAYWRIGHT_TEST_PASSWORD || password;

  if (!email || !password) {
    throw new Error("Main login Email or Password is not set in environment variables.");
  }
  if (!testEmail || !testPassword) {
    throw new Error("Test Email or Test Password is not set in environment variables.");
  }

  return { email, password, testEmail, testPassword };
}
