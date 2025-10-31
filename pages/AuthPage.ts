import { expect, Locator, Page } from '@playwright/test';

type AuthElements = {
  emailInput: Locator;
  passwordInput: Locator;
  submitButton: Locator;
  logoutButton: Locator;
  errorMessages: Locator;
  signUpNowButton: Locator;
};

export class AuthPage {
  private readonly page: Page;
  private readonly els: AuthElements;

  constructor(page: Page) {
    this.page = page;
    this.els = this.createElements();
    this.page.setDefaultTimeout(5000);
  }

  get elements(): AuthElements {
    return this.els;
  }

  async open(path: string = '/'): Promise<void> {
    await this.page.goto(path);
    await this.elements.emailInput.waitFor({ state: 'visible' });
  }

  private createElements(): AuthElements {
    return {
      emailInput: this.page.locator('input[type="email"]'),
      passwordInput: this.page.locator('input[type="password"]'),
      submitButton: this.page.getByRole('button', { name: 'Sign In', exact: true }),
      logoutButton: this.page.getByRole('button', { name: 'Logout' }),
      errorMessages: this.page.locator('.__error'),
      signUpNowButton: this.page.getByRole('button', { name: 'Sign Up Now' }),
    };
  }

  async fillCredentials(email: string, password: string): Promise<void> {
    await this.elements.emailInput.fill(email);
    await this.elements.passwordInput.fill(password);
  }

  async submit(): Promise<void> {
    await this.elements.submitButton.click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillCredentials(email, password);
    await this.submit();
  }

  async openSignUpForm(): Promise<void> {
    await this.elements.signUpNowButton.click();
  }

  async verifyLogoutBtn(): Promise<void> {
    await expect(this.elements.logoutButton).toBeVisible();
    await expect(this.elements.logoutButton).toContainText('Logout');
  }

  async verifyErrorMessages(expected: string | string[]): Promise<void> {
    const expectedMessages = Array.isArray(expected) ? expected : [expected];
    const actualMessages = (await this.elements.errorMessages.allTextContents()).map((msg) =>
      msg.replace(/\s+/g, ' ').trim(),
    );

    expect(actualMessages.length, 'No error messages visible').toBeGreaterThan(0);
    for (const message of expectedMessages) {
      const normalized = message.replace(/\s+/g, ' ').trim();
      expect(
        actualMessages.includes(normalized),
        `Error message "${normalized}" not found in ${JSON.stringify(actualMessages)}`,
      ).toBe(true);
    }
  }
}
