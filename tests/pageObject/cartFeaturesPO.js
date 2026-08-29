export class CartPO {
    constructor(page) {
        this.page = page;
        this.addToCartBtn = page.getByRole('button', { name: 'Add to Cart' });
        this.cartSuccessMessage = page.locator('.alert-success');
        this.cartItemsCount = page.locator('#cart-total');
        this.cartLink = page.locator('#cart > button');
        this.cartItemsList = page.locator('#content form .table-responsive tbody tr');
        this.totalPrice = page.locator('#content .table-bordered tr').last().locator('td').last();
    }


    async addProductToCart(productName) {
        await this.page.goto('https://tutorialsninja.com/demo/index.php?route=common/home', { waitUntil: 'domcontentloaded' });
        await this.page.fill('input[name="search"]', productName);
        await this.page.locator("#search button[type='button']").click();
        await this.addToCartBtn.first().click();
        await this.cartSuccessMessage.waitFor();
    }

    async addMultipleProducts() {
        const products = ["iPhone", "MacBook"];
        for (const product of products) {
            await this.addProductToCart(product);
        }
    }

    async openCart() {
        await this.page.goto('https://tutorialsninja.com/demo/index.php?route=checkout/cart', { waitUntil: 'domcontentloaded' });
    }

    async removeProductFromCart(productName) {
        await this.openCart();
        const productRow = this.cartItemsList.filter({ hasText: productName }).first();
        await productRow.locator('button[type="button"]').click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async updateProductQuantityInCart(productName, quantity) {
        await this.openCart();
        const productRow = this.cartItemsList.filter({ hasText: productName }).first();
        const quantityInput = productRow.locator('input[name="quantity"]');
        await quantityInput.fill(quantity.toString());
        await productRow.locator('button[type="submit"]').click();
        await this.page.waitForLoadState('domcontentloaded');
    }   

    async getCartItemsCount() {
        const countText = await this.cartItemsCount.textContent();
        const match = countText.match(/(\d+) item/);
        return match ? parseInt(match[1]) : 0;
    };
}
