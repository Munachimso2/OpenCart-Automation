export class registerPO {
    constructor(page) {
        this.page = page;
        this.firstName = page.locator("#input-firstname");
        this.lastName = page.locator("#input-lastname");
        this.email = page.locator("#input-email");
        this.telephone = page.locator("#input-telephone");
        this.password = page.locator("#input-password");
        this.confirmPassword = page.locator("#input-confirm");
        this.privacyPolicyCheckbox = page.locator("input[name='agree']");
        this.continueButton = page.locator("input[value='Continue']");
        this.errorMessageAlreadyRegistered = page.getByText("Warning: E-Mail Address is already registered!");
        this.successMessage = page.locator("#content h1");
        this.errorMessage = page.locator(".alert-danger");
        this.countAlerts = page.locator("div.text-danger");
        this.wrongEmailalerts = page.getByText("E-Mail Address does not appear to be valid!"); // This is for wrong email format
        this.continueToLoginButton = page.getByRole("link", { name: "Continue" });
        this.privacyPolicyErrorMessage = page.getByText("Warning: You must agree to the Privacy Policy!");
    }

    async goto() {
        await this.page.goto("https://tutorialsninja.com/demo/index.php?route=account/register");
        await this.page.waitForLoadState("networkidle");
    }
    async register(firstName, lastName, email, telephone, password) {
        await this.firstName.fill(firstName);
        await this.lastName.fill(lastName);
        await this.email.fill(email);
        await this.telephone.fill(telephone);
        await this.password.fill(password);
        await this.confirmPassword.fill(password);
        await this.privacyPolicyCheckbox.check();
        await this.continueButton.click();
        await this.page.waitForLoadState("networkidle");
    }
    async getErrorMessages() {
        const errorMessages = [];
        const count = await this.countAlerts.count();
        for (let i = 0; i < count; i++) {
            errorMessages.push(await this.countAlerts.nth(i).textContent());
        }
        return errorMessages;
    }
    async continueToLogin() {
        await this.continueToLoginButton.click();
        await this.page.waitForLoadState("networkidle");
    }
    async acceptPrivacyPolicy() {
        await this.privacyPolicyCheckbox.check();
        await this.page.waitForLoadState("networkidle");
    }
    async clickContinue() {
        await this.continueButton.click();
        await this.page.waitForLoadState("networkidle");
    }
}