export class searchPO {
    constructor(page) {
        this.page = page;
        this.searchInput = page.locator("#search input[name='search']");
        this.searchButton = page.locator("#search button[type='button']");
        this.noResultsMessage = page.getByText("There is no product that matches the search criteria.");
        this.productLayout = page.locator(".product-layout")
    }

    async searchForProduct(productName) {
        await this.searchInput.fill(productName);
        await this.searchButton.click();
        await this.page.waitForLoadState("networkidle");
    }
}