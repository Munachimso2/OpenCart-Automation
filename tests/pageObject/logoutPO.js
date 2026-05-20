export class LogoutPO {
    constructor(page) {
        this.page = page;
        this.logoutButton = page.getByRole('link', { name: 'Logout' }).nth(0);
        this.accountLogoutHeading = page.locator("a.dropdown-toggle")
        this.continueButton = page.getByRole('link', { name: 'Continue' });
    }

    async clickLogout() {
        await this.accountLogoutHeading.click();
        await this.logoutButton.click();
        await this.page.waitForLoadState("networkidle");
    }

    async clickContinue() {
        await this.continueButton.click();
        await this.page.waitForLoadState("networkidle");
    }
}