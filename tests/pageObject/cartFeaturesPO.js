export class CartPO {
    constructor(page) {
        this.page = page;
        this.addToCartBtn = page.getByRole('button', { name: 'Add to Cart' });
        this.cartSuccessMessage = page.locator('.alert-success');
        this.cartItemsCount = page.locator('#cart-total');
        this.cartLink = page.locator('#cart > button');
        this.cartItemsList = page.locator('.dropdown-menu .cart-info');
    }


    async addProductToCart(productName) {
        await this.page.fill('input[name="search"]', productName);
        await this.page.click('button[type="submit"]');
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
        await this.cartLink.click();        
    }

    async removeProductFromCart(productName) {
        await this.openCart();
        const productRow = this.cartItemsList.locator(`text=${productName}`).first();
        await productRow.locator('button[title="Remove"]').click();
    }

    async updateProductQuantityInCart(productName, quantity) {
        await this.openCart();
        const productRow = this.cartItemsList.locator(`text=${productName}`).first();
        const quantityInput = productRow.locator('input[name="quantity"]');
        await quantityInput.fill(quantity.toString());
        await quantityInput.press('Enter');
    }   

    async getCartItemsCount() {
        const countText = await this.cartItemsCount.textContent();
        const match = countText.match(/(\d+) item/);
        return match ? parseInt(match[1]) : 0;
    };
}