const { test, expect } = require('@playwright/test');  // import Playwright

test.describe('Login', () => {                          // group of login tests

  test.beforeEach(async ({ page }) => {                 // runs before each test
    await page.goto('https://www.saucedemo.com/');      // open the site
  });

  //POSITIVE TEST — happy path
  test('successful login redirects to inventory page', async ({ page }) => {
    await page.getByPlaceholder('Username').fill('standard_user');  // valid user
    await page.getByPlaceholder('Password').fill('secret_sauce');   // valid password
    await page.getByRole('button', { name: 'Login' }).click();      // submit

    await expect(page).toHaveURL(/inventory\.html/);                         // URL changed
    await expect(page.getByText('Products')).toBeVisible();                  // heading shown
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6); // 6 items
  });

  // NEGATIVE TEST — invalid credentials
  test('invalid credentials show error message', async ({ page }) => {
    await page.getByPlaceholder('Username').fill('not_a_real_user');  //invalid username
    await page.getByPlaceholder('Password').fill('wrong_password');   //invalid password
    await page.getByRole('button', { name: 'Login' }).click();

    const error = page.locator('[data-test="error"]');
    await expect(error).toBeVisible();
    await expect(error).toContainText('do not match any user');   //error message 
    await expect(page).not.toHaveURL(/inventory\.html/);         // stayed on login
  });

});