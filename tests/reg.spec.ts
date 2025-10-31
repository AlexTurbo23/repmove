import { test } from '@playwright/test';
import { AuthPage } from '../pages/AuthPage';
import { RegistrationPage } from '../pages/RegistrationPage';

test.describe('Test 1 - Successful registration with valid data', () => {
  test('Account successfully created; redirected to dashboard.', async ({ page }) => {
    const auth = new AuthPage(page);
    const reg = new RegistrationPage(page);
    await test.step('Open main page', async () => {
      await auth.open('/');
    });

    await test.step('Open sign up form', async () => {
      await auth.openSignUpForm();
    });

    await test.step('Fill registration form', async () => {
      await reg.fillSignUpFormWithUniqueEmail(
        'TestFirstName',
        'TestLastName',
        'TestCompany',
        'Qwerty123!',
        '664089599',
      );
    });

    await test.step('Verify logout button after registration and login', async () => {
      await auth.verifyLogoutBtn();
    });
  });
});

test.describe('Test 2 - Empty form submission', () => {
  test('Form validation triggered, error messages displayed; submission blocked.', async ({
    page,
  }) => {
    const auth = new AuthPage(page);
    const reg = new RegistrationPage(page);
    await test.step('Open main page', async () => {
      await auth.open('/');
    });

    await test.step('Open sign up form', async () => {
      await auth.openSignUpForm();
    });

    await test.step('Fill registration form', async () => {
      await reg.clickSignUpBtn();
    });

    await test.step('Verify error messages for empty fields', async () => {
      await auth.verifyErrorMessages([
        'The First Name is required',
        'The Last Name is required',
        'The Company Name is required',
        'Please, enter your email address',
        'The Phone is required',
        'The Password is required',
      ]);
    });
  });
});

test.describe('Test 3 - Registration with existing email', () => {
  test(' Account is not created; user remains on the registration page.', async ({ page }) => {
    const auth = new AuthPage(page);
    const reg = new RegistrationPage(page);
    await test.step('Open main page', async () => {
      await auth.open('/');
    });

    await test.step('Open sign up form', async () => {
      await auth.openSignUpForm();
    });

    await test.step('Fill registration form', async () => {
      await reg.fillSignUpForm(
        'TestFirstName',
        'TestLastName',
        'TestCompany',
        'turbo2387@mailinator.com',
        'Qwerty123!',
        '664089599',
      );
    });
    await test.step('Verify toast message after registration with existing email', async () => {
      await reg.verifyToastMessage();
    });
  });
});
