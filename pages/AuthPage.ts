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

  // Вспомогательные методы
  private normalize(text: string): string {
    return text.replace(/\s+/g, ' ').trim().toLowerCase();
  }

  private async getNormalizedErrorMessages(): Promise<string[]> {
    const texts = await this.elements.errorMessages.allTextContents();
    return texts.map((t) => this.normalize(t));
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
    // Сначала пробуем явную кнопку "Sign Up Now"
    if (await this.elements.signUpNowButton.isVisible().catch(() => false)) {
      await this.elements.signUpNowButton.click();
    } else {
      // Фоллбек: ищем любую кнопку/ссылку c текстом "Sign Up"
      const btn = this.page.getByRole('button', { name: /sign up/i });
      const link = this.page.getByRole('link', { name: /sign up/i });
      if (await btn.isVisible().catch(() => false)) {
        await btn.click();
      } else {
        await link.click();
      }
    }

    // Дожидаемся открытия формы регистрации (поле First Name)
    const firstNameField = this.page
      .locator('app-input')
      .filter({ hasText: 'First Name' })
      .getByRole('textbox');
    await firstNameField.waitFor({ state: 'visible' });
  }

  async verifyLogoutBtn(): Promise<void> {
    await expect(this.elements.logoutButton).toBeVisible();
    await expect(this.elements.logoutButton).toContainText('Logout');
  }

  async verifyErrorMessages(expected: string | string[]): Promise<void> {
    const expectedMessages = (Array.isArray(expected) ? expected : [expected]).map((m) =>
      this.normalize(m),
    );
    const actualMessages = await this.getNormalizedErrorMessages();

    expect(actualMessages.length, 'No error messages visible').toBeGreaterThan(0);
    for (const msg of expectedMessages) {
      expect(
        actualMessages.includes(msg),
        `Error message "${msg}" not found in ${JSON.stringify(actualMessages)}`,
      ).toBe(true);
    }
  }
}
