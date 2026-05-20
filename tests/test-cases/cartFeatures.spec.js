import { test, expect } from '@playwright/test';
import { CartPO } from '../pageObject/cartFeaturesPO';
import { searchPO } from '../pageObject/searchPO';


test.describe("Cart Functionality", () => {

    test("should add product to cart successfully", async ({ page }) => {
        const cartPage = new CartPO(page);
        await cartPage.addProductToCart("iPhone");
        await expect(cartPage.cartSuccessMessage).toBeVisible();
        await expect(cartPage.cartItemsCount).toHaveText("1 item(s)");
    });

    test("should remove product from cart successfully", async ({ page }) => {
        const cartPage = new CartPO(page);
        // Add a product to the cart first
        await cartPage.addProductToCart("iPhone");
        await expect(cartPage.cartItemsCount).toHaveText("1 item(s)");
        // Remove the product from the cart
        await cartPage.removeProductFromCart("iPhone");
        await expect(cartPage.cartItemsCount).toHaveText("0 item(s)");
    });

    test("should update product quantity in cart successfully", async ({ page }) => {
        const cartPage = new CartPO(page);
        // Add a product to the cart first
        await cartPage.addProductToCart("iPhone");
        await expect(cartPage.cartItemsCount).toHaveText("1 item(s)");
        // Update the product quantity in the cart
        await cartPage.updateProductQuantityInCart("iPhone", 2);
        await expect(cartPage.cartItemsCount).toHaveText("2 item(s)");
    });

    test("should add multiple products to cart successfully", async ({ page }) => {
        const cartPage = new CartPO(page);
        await cartPage.addMultipleProducts();
        await expect(cartPage.cartItemsCount).toHaveText("2 item(s)");
    });

    test("should verify total price in cart", async ({ page }) => {
        const cartPage = new CartPO(page);
        await cartPage.addProductToCart("iPhone");
        await cartPage.addProductToCart("MacBook");
        await expect(await cartPage.getCartItemsCount()).toBe(2);
        await cartPage.openCart();
        await expect(cartPage.totalPrice).toHaveText("$1,800.00");
    });

    test("should verify cart is empty after removing all products", async ({ page }) => {
        const cartPage = new CartPO(page);
        await cartPage.addProductToCart("iPhone");
        await cartPage.addProductToCart("MacBook");
        await expect(await cartPage.getCartItemsCount()).toBe(2);
        await cartPage.removeProductFromCart("iPhone");
        await cartPage.removeProductFromCart("MacBook");
        await expect(cartPage.cartItemsCount).toHaveText("0 item(s)");
    });

    test("should verify cart updates after adding and removing products", async ({ page }) => {
        const cartPage = new CartPO(page);
        await cartPage.addProductToCart("iPhone");
        await expect(cartPage.cartItemsCount).toHaveText("1 item(s)");
        await cartPage.addProductToCart("MacBook");
        await expect(cartPage.cartItemsCount).toHaveText("2 item(s)");
        await cartPage.removeProductFromCart("iPhone");
        await expect(cartPage.cartItemsCount).toHaveText("1 item(s)");
    });

    test("should verify cart updates after changing product quantity", async ({ page }) => {
        const cartPage = new CartPO(page);
        await cartPage.addProductToCart("iPhone");
        await expect(cartPage.cartItemsCount).toHaveText("1 item(s)");
        await cartPage.updateProductQuantityInCart("iPhone", 3);
        await expect(cartPage.cartItemsCount).toHaveText("3 item(s)");
    });
});