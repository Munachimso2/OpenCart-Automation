import { test, expect } from '@playwright/test';
import { loginPO } from '../pageObject/loginPO';

test.describe("Login test cases", () => {

    test("valid user login", async ({ page }) => {
        const loginPage = new loginPO(page);
        await loginPage.goto();
        await loginPage.login(process.env.USER_EMAIL, process.env.USER_PASSWORD);
        await expect(loginPage.myAccountHeading).toBeVisible();
        await expect(page.locator("#logo")).toBeVisible();
        await expect(page).toHaveURL("https://tutorialsninja.com/demo/index.php?route=account/account");
    })

    test("invalid user login", async ({ page }) => {
        const loginPage = new loginPO(page);
        await loginPage.goto();
        await loginPage.login("invalid@demo.com", "invalid123");
        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorAlert).toBeVisible();
        await expect(page).toHaveURL("https://tutorialsninja.com/demo/index.php?route=account/login");
    })

    test("invalid password login", async ({ page }) => {
        const loginPage = new loginPO(page);
        await loginPage.goto();
        await loginPage.login(process.env.USER_EMAIL, process.env.USER_PASSWORD + "invalid");
        await expect(loginPage.errorAlert).toBeVisible();
        await expect(page).toHaveURL("https://tutorialsninja.com/demo/index.php?route=account/login");
    })

    test("invalid email login", async ({ page }) => {
        const loginPage = new loginPO(page);
        await loginPage.goto();
        await loginPage.login("invalidemailformat", process.env.USER_PASSWORD);
        await expect(loginPage.errorAlert).toBeVisible();
        await expect(page.getByText("Warning: No match for E-Mail Address and/or Password.")).toBeVisible();
        await expect(page).toHaveURL("https://tutorialsninja.com/demo/index.php?route=account/login");
    })

    test("empty fields login should fail", async ({ page }) => {
        const loginPage = new loginPO(page);
        await loginPage.goto();
        await loginPage.login("", "");
        await expect(loginPage.errorAlert).toBeVisible();
        await expect(page.getByText("Warning: No match for E-Mail Address and/or Password.")).toBeVisible();
        await expect(page).toHaveURL("https://tutorialsninja.com/demo/index.php?route=account/login");
    })

    test("breadcrumb, heading, URL, title should be correct on login page", async ({ page }) => {
        const loginPage = new loginPO(page);
        await loginPage.goto();
        await expect(page.locator("#content > div.row > div:nth-of-type(2) > div.well > h2")).toHaveText("Returning Customer");
        await expect(page.locator("#content > div.row > div:nth-of-type(2) > div.well > h2")).toBeVisible();
        await expect(page.locator("ul.breadcrumb")).toContainText("Login");
        await expect(page.locator("ul.breadcrumb")).toBeVisible();
        await expect(page).toHaveURL("https://tutorialsninja.com/demo/index.php?route=account/login");
    })

    test("Password field masks text", async ({ page }) => {
        const loginPage = new loginPO(page);
        await loginPage.goto();
        await expect(loginPage.userPassword).toHaveAttribute("type", "password");
    })

    test("Email and password fields have placeholder text", async ({ page }) => {
        const loginPage = new loginPO(page);
        await loginPage.goto();
        await expect(loginPage.userEmail).toHaveAttribute("placeholder", "E-Mail Address");
        await expect(loginPage.userPassword).toHaveAttribute("placeholder", "Password");
    })

    test("Browser back after login should stay logged in", async ({ page }) => {
        const loginPage = new loginPO(page);
        await loginPage.goto();
        await loginPage.login(process.env.USER_EMAIL, process.env.USER_PASSWORD);
        await expect(loginPage.myAccountHeading).toBeVisible();
        await page.goBack();
        await expect(loginPage.myAccountHeading).toBeVisible();
    })

    test("Login page should have a 'Forgotten Password' link", async ({ page }) => {
        const loginPage = new loginPO(page);
        await loginPage.goto();
        await expect(loginPage.forgottenPasswordLink).toBeVisible();
        await expect(loginPage.forgottenPasswordLink).toHaveAttribute("href", "https://tutorialsninja.com/demo/index.php?route=account/forgotten");
    })

    test.skip("Exceed login attempts should show error message", async ({ page }) => {

        // Test — Skipped
        // Tutorialsninja is a shared demo site, login attempt limits are not enforced reliably. Test passes on isolated environments only.
        const loginPage = new loginPO(page);
        await loginPage.goto();
        for (let i = 0; i < 17; i++) {
            await loginPage.login("invalid@demo.com", "invalid123");
        }
        await expect(loginPage.errorAlert).toBeVisible();
        await expect(page.getByText("Warning: Your account has exceeded allowed number of login attempts. Please try again in 1 hour.")).toBeVisible();
        await expect(page).toHaveURL("https://tutorialsninja.com/demo/index.php?route=account/login");
    })
})

