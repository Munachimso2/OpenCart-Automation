import { test, expect } from '@playwright/test';
import { registerPO } from '../pageObject/registerPO';
import { loginPO } from '../pageObject/loginPO';

test.describe.serial('Register and Login Flow', () => {
    let testEmail;

    test('should register a new user', async ({ page }) => {
        const registerPage = new registerPO(page);
        await registerPage.goto();
        testEmail = `testuser${Date.now()}@gmail.com`;
        await registerPage.register("John", "Doe", testEmail, process.env.PHONE_NUMBER, process.env.USER_PASSWORD);
        await expect(registerPage.successMessage).toHaveText("Your Account Has Been Created!");
        await expect(registerPage.successMessage).toBeVisible();
        expect(page.url()).toBe("https://tutorialsninja.com/demo/index.php?route=account/success")
        await registerPage.continueToLogin();
    });

    test('should login with registered user', async ({ page }) => {
        const loginPage = new loginPO(page);
        await loginPage.goto();
        await loginPage.login(testEmail, process.env.USER_PASSWORD);
        await expect(page.getByRole("heading", { name: "My Account" }).nth(0)).toBeVisible();
    });
});

// Other tests...

test.describe("Other registration test cases", () => {

    test('should display error with invalid email', async ({ page }) => {
        const registerPage = new registerPO(page);
        await registerPage.goto();
        await registerPage.register("John", "Doe", process.env.USER_EMAIL.replace(".com", ""), process.env.PHONE_NUMBER, process.env.USER_PASSWORD);
        await expect(registerPage.wrongEmailalerts).toBeVisible();
    });

    test('should display error with weak password', async ({ page }) => {
        const registerPage = new registerPO(page);
        await registerPage.goto();
        await registerPage.register("Bob", "Smith", process.env.USER_EMAIL, process.env.PHONE_NUMBER, "123");
        await expect(registerPage.errorMessage).toBeVisible();
    });

    test('should display error with empty required fields', async ({ page }) => {
        const registerPage = new registerPO(page);
        await registerPage.goto();
        await registerPage.register("", "", "", "", "");
        await expect(registerPage.countAlerts).toHaveCount(5);
        await expect(registerPage.countAlerts.nth(0)).toBeVisible();
        await expect(registerPage.countAlerts.nth(1)).toBeVisible();
        await expect(registerPage.countAlerts.nth(2)).toBeVisible();
        await expect(registerPage.countAlerts.nth(3)).toBeVisible();
        await expect(registerPage.countAlerts.nth(4)).toBeVisible();
    });

    test('should display error when email is already registered', async ({ page }) => {
        const registerPage = new registerPO(page);
        await registerPage.goto();
        await registerPage.register("John", "Doe", process.env.USER_EMAIL, process.env.PHONE_NUMBER, process.env.USER_PASSWORD);
        await expect(registerPage.errorMessageAlreadyRegistered).toBeVisible();
    });

    test("should display error without agreeing privacy policy", async ({ page }) => {
        const registerPage = new registerPO(page);
        await registerPage.goto();
        await registerPage.firstName.fill("Alice");
        await registerPage.lastName.fill("Johnson");
        await registerPage.email.fill(`alice${Date.now()}@gmail.com`);
        await registerPage.telephone.fill(process.env.PHONE_NUMBER);
        await registerPage.password.fill(process.env.USER_PASSWORD);
        await registerPage.confirmPassword.fill(process.env.USER_PASSWORD);
        // Do not check the privacy policy checkbox
        await registerPage.continueButton.click();
        await expect(registerPage.privacyPolicyErrorMessage).toBeVisible();
    })

    test("should newsletter yes and not affect registration", async ({ page }) => {
        const registerPage = new registerPO(page);
        await registerPage.goto();
        await registerPage.firstName.fill("Charlie");
        await registerPage.lastName.fill("Brown");
        const uniqueEmail = `charlie${Date.now()}@gmail.com`;
        await registerPage.email.fill(uniqueEmail);
        await registerPage.telephone.fill(process.env.PHONE_NUMBER);
        await registerPage.password.fill(process.env.USER_PASSWORD);
        await registerPage.confirmPassword.fill(process.env.USER_PASSWORD);
        await registerPage.privacyPolicyCheckbox.check();
        // Check the newsletter subscription
        await page.locator("input[name='newsletter'][value='1']").check();
        await registerPage.continueButton.click();
        await expect(registerPage.successMessage).toHaveText("Your Account Has Been Created!");
        await expect(registerPage.successMessage).toBeVisible();
        expect(page.url()).toBe("https://tutorialsninja.com/demo/index.php?route=account/success")
    });

    test("invalid phone number should show error", async ({ page }) => {
        const registerPage = new registerPO(page);
        await registerPage.goto();
        await registerPage.firstName.fill("David");
        await registerPage.lastName.fill("Smith");
        const uniqueEmail = `david${Date.now()}@gmail.com`;
        await registerPage.email.fill(uniqueEmail);
        await registerPage.telephone.fill("i");
        await registerPage.password.fill(process.env.USER_PASSWORD);
        await registerPage.confirmPassword.fill(process.env.USER_PASSWORD);
        await registerPage.privacyPolicyCheckbox.check();
        await registerPage.continueButton.click();
        await expect(registerPage.countAlerts.nth(0)).toBeVisible();
        await expect(registerPage.countAlerts.nth(0)).toHaveText(/Telephone must be between 3 and 32 characters!/);
    });

    test("confirms placeholders exist", async ({ page }) => {
        const registerPage = new registerPO(page);
        await registerPage.goto();
        await expect(registerPage.firstName).toHaveAttribute("placeholder", "First Name");
        await expect(registerPage.lastName).toHaveAttribute("placeholder", "Last Name");
        await expect(registerPage.email).toHaveAttribute("placeholder", "E-Mail");
        await expect(registerPage.telephone).toHaveAttribute("placeholder", "Telephone");
        await expect(registerPage.password).toHaveAttribute("placeholder", "Password");
        await expect(registerPage.confirmPassword).toHaveAttribute("placeholder", "Password Confirm");
        await expect(registerPage.continueButton).toBeVisible();
    });

    test("should confirm privacy policy is unchecked by default", async ({ page }) => {
        const registerPage = new registerPO(page);
        await registerPage.goto();
        await expect(registerPage.privacyPolicyCheckbox).not.toBeChecked();
    });

    test("should confirm newsletter is unchecked by default", async ({ page }) => {
        const registerPage = new registerPO(page);
        await registerPage.goto();
        await expect(page.locator("input[name='newsletter'][value='1']")).not.toBeChecked();
    });

    test("password filled but confirm empty should show error", async ({ page }) => {
        const registerPage = new registerPO(page);
        await registerPage.goto();
        await registerPage.firstName.fill("Eve");
        await registerPage.lastName.fill("Smith");
        const uniqueEmail = `eve${Date.now()}@gmail.com`;
        await registerPage.email.fill(uniqueEmail);
        await registerPage.telephone.fill(process.env.PHONE_NUMBER);
        await registerPage.password.fill(process.env.USER_PASSWORD);
        // Leave confirm password empty
        await registerPage.privacyPolicyCheckbox.check();
        await registerPage.continueButton.click();
        await expect(registerPage.countAlerts.nth(0)).toBeVisible();
        await expect(registerPage.countAlerts.nth(0)).toHaveText(/Password confirmation does not match password!/);
    });

    test("breadcrumb, heading, URL, title should be correct on registration page", async ({ page }) => {
        const registerPage = new registerPO(page);
        await registerPage.goto();
        await expect(page.locator("#content h1")).toHaveText("Register Account");
        await expect(page.locator("#content h1")).toBeVisible();
        await expect(page.locator("ul.breadcrumb")).toContainText("Register");
        expect(page.url()).toBe("https://tutorialsninja.com/demo/index.php?route=account/register");
        await expect(page).toHaveTitle("Register Account");
    });

    test("should confirm that password is masked", async ({ page }) => {
        const registerPage = new registerPO(page);
        await registerPage.goto();
        await expect(registerPage.password).toHaveAttribute("type", "password");
        await expect(registerPage.confirmPassword).toHaveAttribute("type", "password");
    });

})

