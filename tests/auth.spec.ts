import { test } from '@playwright/test';
import { AuthPage } from '../pages/AuthPage';
import credentials from '../utils/credentials';

let auth: AuthPage;

test.beforeEach(async ({ page }) => {
  auth = new AuthPage(page);
  await auth.open('/');
});

test.describe('Login flow', () => {
  test('Test 1 - Successful login', async () => {
    await test.step('Perform login', async () => {
      await auth.login(credentials.email, credentials.password);
    });

    await test.step('Verify logout button after login', async () => {
      await auth.verifyLogoutBtn();
    });
  });

  test('Test 2 - Login with empty fields', async () => {
    await test.step('Perform login with empty fields', async () => {
      await auth.login(credentials.emailEmpty, credentials.passwordEmpty);
    });

    await test.step('Verify validation error messages are displayed', async () => {
      await auth.verifyErrorMessages([
        'Please, enter your email address',
        'The Password is required',
      ]);
    });
  });

  test('Test 3 - Invalid email format in login', async () => {
    await test.step('Perform login with invalid email format', async () => {
      await auth.login(credentials.invalidEmail, credentials.password);
    });

    await test.step('Verify error message is displayed', async () => {
      await auth.verifyErrorMessages(['Invalid email address']);
    });
  });
});
