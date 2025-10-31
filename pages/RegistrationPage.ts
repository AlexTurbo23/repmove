import { expect, Locator, Page } from '@playwright/test';

type RegistrationElements = {
  firstNameField: Locator;
  lastNameField: Locator;
  companyNameField: Locator;
  emailField: Locator;
  passwordField: Locator;
  phoneField: Locator;
  signUpButton: Locator;
  toastMessage: Locator;
};

export class RegistrationPage {
  private readonly page: Page;
  private readonly els: RegistrationElements;

  constructor(page: Page) {
    this.page = page;
    this.els = this.createElements();
    this.page.setDefaultTimeout(5000);
  }

  get elements(): RegistrationElements {
    return this.els;
  }

  private createElements(): RegistrationElements {
    return {
      firstNameField: this.page
        .locator('app-input')
        .filter({ hasText: 'First Name' })
        .getByRole('textbox'),
      lastNameField: this.page
        .locator('app-input')
        .filter({ hasText: 'Last Name' })
        .getByRole('textbox'),
      companyNameField: this.page
        .locator('app-input')
        .filter({ hasText: 'Company Name' })
        .getByRole('textbox'),
      emailField: this.page.locator('input[type="email"]'),
      passwordField: this.page.locator('input[type="password"]'),
      phoneField: this.page.locator('app-input').filter({ hasText: 'Phone' }).getByRole('textbox'),
      signUpButton: this.page.getByRole('button', { name: 'Sign Up', exact: true }),
      toastMessage: this.page.getByRole('alert', { name: 'Invalid to sign up' }),
    };
  }

  generateUniqueEmail(base = 'test@gmail.com'): string {
    const [name, domain] = base.split('@');
    const random = Math.floor(100000 + Math.random() * 900000);
    return `${name}+${random}@${domain}`;
  }

  private async waitForForm(): Promise<void> {
    await this.elements.firstNameField.waitFor({ state: 'visible' });
  }

  async fillSignUpForm(
    firstName: string,
    lastName: string,
    companyName: string,
    password: string,
    phone: string,
    options?: { email?: string; uniqueEmail?: boolean },
  ): Promise<void> {
    const email =
      options?.email ??
      (options?.uniqueEmail === false ? 'test@gmail.com' : this.generateUniqueEmail());

    await this.waitForForm();
    await this.elements.firstNameField.fill(firstName);
    await this.elements.lastNameField.fill(lastName);
    await this.elements.companyNameField.fill(companyName);
    await this.elements.emailField.fill(email);
    await this.elements.passwordField.fill(password);
    await this.selectRandomIndustry();
    await this.selectCountry();
    await this.elements.phoneField.fill(phone);
    await this.clickSignUpBtn();
  }

  async selectRandomIndustry(): Promise<void> {
    const industries = [
      'Distributor',
      'Food & Beverage',
      'Insurance & Benefits',
      'Manufacturer',
      'Medical',
      'Pharmaceutical',
      'Professional Services',
      'Rep Agency',
      'Equipment Rental',
      'Other Industry',
    ] as const;
    const randomIndustry = industries[Math.floor(Math.random() * industries.length)];
    await this.page.locator('[formcontrolname="industry"]').click();
    await this.page.getByRole('option', { name: randomIndustry }).click();
  }

  async selectCountry(): Promise<void> {
    await this.page.locator('[placeholder="Country"]').click();
    await this.page.getByRole('option', { name: '+380' }).click();
  }

  async clickSignUpBtn(): Promise<void> {
    await this.elements.signUpButton.click();
  }

  async verifyToastMessage(text: string): Promise<void> {
    await expect(this.elements.toastMessage).toBeVisible();
    await expect(this.elements.toastMessage).toContainText(text);
  }
}
