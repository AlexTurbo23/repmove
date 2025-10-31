import { test } from '@playwright/test';
import { AuthPage } from '../pages/AuthPage';
import credentials from '../utils/credentials';

test.describe('Test 1 - Successful login', () => {
  test('User successfully logged in; redirected to main page.', async ({ page }) => {
    const auth = new AuthPage(page);
    await test.step('Open main page', async () => {
      await auth.open('/');
    });

    await test.step('Perform login', async () => {
      await auth.login(credentials.email, credentials.password);
    });

    await test.step('Verify logout button after login', async () => {
      await auth.verifyLogoutBtn();
    });
  });
});

test.describe('Test 2 - Login with empty fields', () => {
  test('Validation errors shown; cannot submit.', async ({ page }) => {
    const auth = new AuthPage(page);
    await test.step('Open main page', async () => {
      await auth.open('/');
    });

    await test.step('Perform login', async () => {
      await auth.login(credentials.emailEmpty, credentials.passwordEmpty);
    });

    await test.step('Verify error messages are displayed', async () => {
      await auth.verifyErrorMessages([
        'Please, enter your email address',
        'The Password is required',
      ]);
    });
  });
});

test.describe('Test 3 - Invalid email format in login', () => {
  test("Error message 'Invalid email address' displayed.", async ({ page }) => {
    const auth = new AuthPage(page);
    await test.step('Open main page', async () => {
      await auth.open('/');
    });

    await test.step('Perform login', async () => {
      await auth.login(credentials.invalidEmail, credentials.password);
    });

    await test.step('Verify error message is displayed', async () => {
      await auth.verifyErrorMessages(['Invalid email address']);
    });
  });
});
