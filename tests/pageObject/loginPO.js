export class LoginPO {
    constructor(page) {
        this.page = page;
        this.userEmail = page.locator("#input-email");
        this.userPassword = page.locator("#input-password");
        this.loginButton = page.locator("input[value='Login']");
        this.errorAlert = page.locator(".alert-danger");
        this.errorMessage = page.getByText("Warning: No match for E-Mail Address and/or Password.")
        this.forgottenPasswordLink = page.locator("#content>div.row>div:nth-of-type(2)>div.well>form>div:nth-of-type(2)>a");
        this.myAccountHeading = page.getByRole("heading", { name: "My Account" }).nth(0);
    }

    async goto() {
        await this.page.goto("https://tutorialsninja.com/demo/index.php?route=account/login")
        await this.page.waitForLoadState("networkidle");
    }

    async login(email, password) {
        await this.userEmail.fill(email);
        await this.userPassword.fill(password);
        await this.loginButton.click();
        await this.page.waitForLoadState("networkidle");
    }
} 