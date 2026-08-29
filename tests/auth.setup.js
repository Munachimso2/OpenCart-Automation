import { test as setup, expect } from '@playwright/test'
import dotenv from 'dotenv'
dotenv.config({ quiet: true })

setup('authenticate', async ({ page }) => {
    await page.goto('https://tutorialsninja.com/demo/index.php?route=account/login')
    await page.locator('#input-email').fill(process.env.USER_EMAIL)
    await page.locator('#input-password').fill(process.env.USER_PASSWORD)
    await page.locator("input[value='Login']").click()
    await expect(page).toHaveURL(/route=account\/account/)
    await expect(page.getByRole('heading', { name: 'My Account' }).first()).toBeVisible()
    await page.context().storageState({ path: 'auth.json' })
})
