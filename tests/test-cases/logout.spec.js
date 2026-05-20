import { test, expect } from '@playwright/test';
import { LogoutPO } from '../pageObject/logoutPO';
import { LoginPO } from "../pageObject/loginPO"
test.use({ storageState: 'auth.json' });



test.describe('Logout Functionality', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the account page before each test
        await page.goto('https://tutorialsninja.com/demo/index.php?route=account/account');
    });

    test.afterEach(async ({ page }) => {
        // Clear cookies and local storage after each test to ensure a clean state
        await page.context().clearCookies();
        await page.evaluate(() => localStorage.clear());
    });

    // Test cases will go here

    test('should log out successfully', async ({ page }) => {
        const logoutPO = new LogoutPO(page);
        // Navigate to the login page
        await page.goto('https://tutorialsninja.com/demo/index.php?route=account/account');
        await logoutPO.clickLogout();
        await expect(page).toHaveURL('https://tutorialsninja.com/demo/index.php?route=account/logout');
        await logoutPO.clickContinue();
        await expect(page).toHaveURL('https://tutorialsninja.com/demo/index.php?route=common/home');
    });

    test("Browser back after logout should not log user back in", async ({ page }) => {
        const logoutPO = new LogoutPO(page);
        // Navigate to the login page
        await page.goto('https://tutorialsninja.com/demo/index.php?route=account/account');
        // Log out first
        await logoutPO.clickLogout();
        await expect(page).toHaveURL('https://tutorialsninja.com/demo/index.php?route=account/logout');
        await logoutPO.clickContinue();
        await expect(page).toHaveURL('https://tutorialsninja.com/demo/index.php?route=common/home');
        // Try to navigate back to the login page
        await page.goBack();
        await page.reload();
        await page.waitForLoadState("networkidle");
        await expect(page).toHaveURL('https://tutorialsninja.com/demo/index.php?route=account/login');
    });

    // This test is skipped because the we are authenticated therefore we dont have a way to 
    // test the login functionality without logging out first, which is already covered in the first test. 
    // In a real-world scenario, you would want to have a separate test for login functionality that can be run independently of the logout tests.
    test("Should not be able to access account page after logout", async ({ page }) => {
        const logoutPO = new LogoutPO(page);
        // Navigate to the login page
        await page.goto('https://tutorialsninja.com/demo/index.php?route=account/account');
        // Log out first
        await logoutPO.clickLogout();
        await expect(page).toHaveURL('https://tutorialsninja.com/demo/index.php?route=account/logout');
            // Try to navigate back to the account page
        await page.goto('https://tutorialsninja.com/demo/index.php?route=account/account');
        await expect(page).toHaveURL('https://tutorialsninja.com/demo/index.php?route=account/login');
    });

    test("Can login again immediately after logout", async ({ page }) => {
        const logoutPO = new LogoutPO(page);
        const loginPage = new LoginPO(page);
        // Navigate to the login page
        await page.goto('https://tutorialsninja.com/demo/index.php?route=account/account');
        // Log out first
        await logoutPO.clickLogout();
        await expect(page).toHaveURL('https://tutorialsninja.com/demo/index.php?route=account/logout');
        await logoutPO.clickContinue();
        await expect(page).toHaveURL('https://tutorialsninja.com/demo/index.php?route=common/home');
        // Now navigate to the login page and attempt to log in again
        await page.goto('https://tutorialsninja.com/demo/index.php?route=account/login');
        // Fill in the login form and submit it
        await loginPage.login(process.env.USER_EMAIL, process.env.USER_PASSWORD);
        await expect(loginPage.myAccountHeading).toBeVisible();
        await expect(page).toHaveURL("https://tutorialsninja.com/demo/index.php?route=account/account");
    });


});
