import { test as setup } from '@playwright/test'
import dotenv from 'dotenv'
dotenv.config()

setup('authenticate', async ({ page }) => {
    await page.goto('https://tutorialsninja.com/demo/index.php?route=account/login')
    await page.locator('#input-email').fill(process.env.USER_EMAIL)
    await page.locator('#input-password').fill(process.env.USER_PASSWORD)
    await page.locator("input[value='Login']").click()
    await page.waitForLoadState('networkidle')
    await page.context().storageState({ path: 'auth.json' })
})