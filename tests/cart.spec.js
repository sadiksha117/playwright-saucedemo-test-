const { test, expect } = require('@playwright/test');  // import Playwright

test.describe('Shopping Cart', () => {                  // group of cart tests

  test.beforeEach(async ({ page }) => {                 // runs before each test
    await page.goto('https://www.saucedemo.com/');                   // open site
    await page.getByPlaceholder('Username').fill('standard_user');   // enter username
    await page.getByPlaceholder('Password').fill('secret_sauce');    // enter password
    await page.getByRole('button', { name: 'Login' }).click();       // click login
    await expect(page).toHaveURL(/inventory\.html/);                 // confirm logged in
    });

  //  Add item to cart
    test(' Check if user can add a product to the cart', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click(); // add backpack

    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1'); // badge shows 1
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible(); // button flipped

    await page.locator('[data-test="shopping-cart-link"]').click();  // open cart
    await expect(page).toHaveURL(/cart\.html/);                      // on cart page
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible(); // item listed
    });

  // Remove item (inverse action)
    test('Check if user can remove a product from the cart', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click(); // add first
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1'); // verify added

    await page.locator('[data-test="remove-sauce-labs-backpack"]').click(); // click Remove

    await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible(); // badge gone
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toBeVisible(); // button flipped back
  });

});