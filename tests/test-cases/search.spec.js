import { test, expect } from '@playwright/test';
import { searchPO} from '../pageObject/searchPO';  

test.describe("Search test cases", () => {

    test("search for existing product should show results", async ({ page }) => {
        const searchPage = new searchPO(page);
        await page.goto('https://tutorialsninja.com/demo/index.php?route=common/home');
        await searchPage.searchForProduct("iPhone");
        await expect(searchPage.productLayout).toBeVisible();
        await expect(searchPage.productLayout).toHaveCount(1);
    });

    test("search for non-existing product should show no results message", async ({ page }) => {
        const searchPage = new searchPO(page);
        await page.goto('https://tutorialsninja.com/demo/index.php?route=common/home');
        await searchPage.searchForProduct("NonExistingProduct123");
        await expect(searchPage.noResultsMessage).toBeVisible();
    });

    test("search with empty input should show no results message", async ({ page }) => {
        const searchPage = new searchPO(page);
        await page.goto('https://tutorialsninja.com/demo/index.php?route=common/home');
        await searchPage.searchForProduct("");
        await expect(searchPage.noResultsMessage).toBeVisible();
    });

    test("search with special characters should show no results message", async ({ page }) => {
        const searchPage = new searchPO(page);
        await page.goto('https://tutorialsninja.com/demo/index.php?route=common/home');
        await searchPage.searchForProduct("@#$%^&*");
        await expect(searchPage.noResultsMessage).toBeVisible();
    });

    test("search for product with different case should show results", async ({ page }) => {
        const searchPage = new searchPO(page);
        await page.goto('https://tutorialsninja.com/demo/index.php?route=common/home');
        await searchPage.searchForProduct("iphone");
        await expect(searchPage.productLayout).toBeVisible();
        await expect(searchPage.productLayout).toHaveCount(1);
    });
})