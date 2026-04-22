const { test, expect } = require('@playwright/test');  // import Playwright

test.describe('Checkout', () => {                       // group of checkout tests

  test.beforeEach(async ({ page }) => {                 // runs before each test
    await page.goto('https://www.saucedemo.com/');                   // open site
    await page.getByPlaceholder('Username').fill('standard_user');   // log in
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/inventory\.html/);                 // confirm logged in

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click(); // add item
    await page.locator('[data-test="shopping-cart-link"]').click();             // open cart
    await page.getByRole('button', { name: 'Checkout' }).click();               // start checkout
    await expect(page).toHaveURL(/checkout-step-one\.html/);                    // on step one
    });

  // POSITIVE TEST — complete checkout happy path
    test('user can complete checkout with valid details', async ({ page }) => {
    await page.getByPlaceholder('First Name').fill('John');          // fill first name
    await page.getByPlaceholder('Last Name').fill('Doe');            // fill last name
    await page.getByPlaceholder('Zip/Postal Code').fill('12345');    // fill zip

    await page.getByRole('button', { name: 'Continue' }).click();    // go to step two
    await expect(page).toHaveURL(/checkout-step-two\.html/);         // on overview page

    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible(); // item is in overview
    await expect(page.locator('[data-test="total-label"]')).toBeVisible(); // total shown

    await page.getByRole('button', { name: 'Finish' }).click();      // complete order
    await expect(page).toHaveURL(/checkout-complete\.html/);         // on success page
    await expect(page.getByText('Thank you for your order')).toBeVisible(); // confirmation
    });

  // NEGATIVE TEST — missing required field shows error
    test('checkout shows error when first name is missing', async ({ page }) => {
    // Leave First Name blank on purpose
    await page.getByPlaceholder('Last Name').fill('Doe');            // only last name
    await page.getByPlaceholder('Zip/Postal Code').fill('12345');    // only zip

    await page.getByRole('button', { name: 'Continue' }).click();    // try to continue

    const error = page.locator('[data-test="error"]');               // error banner
    await expect(error).toBeVisible();                               // error appears
    await expect(error).toContainText('First Name is required');     // correct message
    await expect(page).toHaveURL(/checkout-step-one\.html/);          // stayed on step one
  });

});