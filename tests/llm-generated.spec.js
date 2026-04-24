const { test, expect } = require('@playwright/test');

test.describe('Checkout Flow — LLM Generated', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByLabel('Username').fill('standard_user');
    await page.getByLabel('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('user completes checkout with valid data', async ({ page }) => {
    await page.getByRole('button', { name: 'Add to cart', exact: true }).first().click();
    await page.getByRole('link', { name: /shopping cart/i }).click();
    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.getByLabel('First Name').fill('John');
    await page.getByLabel('Last Name').fill('Doe');
    await page.getByLabel('Zip/Postal Code').fill('12345');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Finish' }).click();
    await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();
    await expect(page).toHaveURL(/checkout-complete\.html/);
  });

  test('checkout fails when first name is missing', async ({ page }) => {
    await page.getByRole('button', { name: 'Add to cart', exact: true }).first().click();
    await page.getByRole('link', { name: /shopping cart/i }).click();
    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.getByLabel('Last Name').fill('Doe');
    await page.getByLabel('Zip/Postal Code').fill('12345');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByRole('alert')).toContainText('First Name is required');
  });

  test('order total equals subtotal plus 8 percent tax', async ({ page }) => {
    await page.getByRole('button', { name: 'Add to cart', exact: true }).first().click();
    await page.getByRole('link', { name: /shopping cart/i }).click();
    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.getByLabel('First Name').fill('John');
    await page.getByLabel('Last Name').fill('Doe');
    await page.getByLabel('Zip/Postal Code').fill('12345');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByTestId('item-total')).toContainText('29.99');
    await expect(page.getByTestId('tax-amount')).toContainText('2.40');
    await expect(page.getByTestId('total-amount')).toContainText('32.39');
  });

  test('user can cancel checkout and return to cart', async ({ page }) => {
    await page.getByRole('button', { name: 'Add to cart', exact: true }).first().click();
    await page.getByRole('link', { name: /shopping cart/i }).click();
    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(page.getByRole('heading', { name: 'Your Cart' })).toBeVisible();
  });

});