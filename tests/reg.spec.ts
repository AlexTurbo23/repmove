import { test } from '@playwright/test';
import { AuthPage } from '../pages/AuthPage';
import { RegistrationPage } from '../pages/RegistrationPage';

let auth: AuthPage;
let reg: RegistrationPage;

test.beforeEach(async ({ page }) => {
  auth = new AuthPage(page);
  reg = new RegistrationPage(page);

  await auth.open('/');
  await auth.openSignUpForm();
});

test.describe('Registration flow', () => {
  test('Test 1 - Successful registration with valid data', async () => {
    await test.step('Fill registration form', async () => {
      await reg.fillSignUpForm(
        'TestFirstName',
        'TestLastName',
        'TestCompany',
        'Qwerty123!',
        '664089599',
        { uniqueEmail: true },
      );
    });

    await test.step('Verify logout button after registration and login', async () => {
      await auth.verifyLogoutBtn();
    });
  });

  test('Test 2 - Empty form submission', async () => {
    await test.step('Send empty form', async () => {
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

  test('Test 3 - Registration with existing email', async () => {
    await test.step('Fill registration form with existing email', async () => {
      await reg.fillSignUpForm(
        'TestFirstName',
        'TestLastName',
        'TestCompany',
        'Qwerty123!',
        '664089599',
        {
          email: 'turbo2387@mailinator.com',
          uniqueEmail: false,
        },
      );
    });

    await test.step('Verify toast message after registration with existing email', async () => {
      await reg.verifyToastMessage('Invalid to sign up');
    });
  });
});
