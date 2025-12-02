// contactsapp/tests/pages/ProfilePage.ts
import { type Locator, type Page, expect } from '@playwright/test';

/**
 * Page Object for the User Profile page.
 */
export class ProfilePage {
    readonly page: Page;
    readonly editProfileBtn: Locator;
    readonly usernameInput: Locator;
    readonly emailInput: Locator;
    readonly imageInput: Locator;
    readonly saveChangesBtn: Locator;
    readonly profileHeader: Locator;
    readonly avatarImg: Locator;

    constructor(page: Page) {
        this.page = page;
        this.editProfileBtn = page.locator("//button[normalize-space()='Edit Profile']");
        this.profileHeader = page.locator("//h2[normalize-space()]");
        this.usernameInput = page.locator("//input[@id='username']");
        this.emailInput = page.locator("//input[@id='email']");
        this.imageInput = page.locator("//input[@id='profile-picture']");
        this.saveChangesBtn = page.locator("//button[normalize-space()='Save Changes']");
        this.avatarImg = page.locator('//img[contains(@alt, "profile picture")]');
    }

    async goto() {
        await this.page.goto('/en/crm/profile');
        await expect(this.editProfileBtn).toBeVisible({ timeout: 10000 });
    }

    async openEditProfile() {
        await this.editProfileBtn.click();
    }

    async updateProfile(username: string, imagePath?: string) {
        await this.openEditProfile();
        await this.usernameInput.fill(username);
        if (imagePath) {
            const inputType = await this.imageInput.getAttribute('type');
            if (inputType === 'file') {
                await this.imageInput.setInputFiles(imagePath);
                // Wait for image preview to appear (indicates file was selected)
                await this.page.waitForTimeout(500);
            } else {
                await this.imageInput.fill(imagePath);
            }
        }
        // Click save and wait for navigation back to profile page
        await Promise.all([
            this.page.waitForURL(/\/crm\/profile$/, { timeout: 15000 }),
            this.saveChangesBtn.click(),
        ]);
        // Wait for page to fully load after navigation
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(1000);
    }

    async expectProfileHeader(username: string) {
        await this.page.locator(`//h2[normalize-space()='${username}']`).waitFor({ state: 'visible' });
    }

    async expectAvatarChanged(oldSrc?: string) {
        // Wait for avatar to be visible and updated
        await expect(this.avatarImg).toBeVisible({ timeout: 10000 });
        
        // Wait for avatar src to change (poll until it's different from oldSrc)
        if (oldSrc) {
            await expect.poll(async () => {
                const newSrc = await this.avatarImg.getAttribute('src');
                return newSrc;
            }, {
                message: 'Avatar src should change after upload',
                timeout: 10000,
            }).not.toBe(oldSrc);
        }
        
        // Get final src
        const newSrc = await this.avatarImg.getAttribute('src');
        // Verify it's not placeholder
        expect(newSrc).not.toBe('/placeholder.svg');
        return newSrc;
    }

    /**
     * Navigates to the Identities admin panel.
     */
    async gotoIdentities() {
        await this.page.goto('/en/crm/admin-panel/identities');
        await expect(this.page.getByRole('heading', { name: 'Admin Panel' })).toBeVisible({ timeout: 10000 });
        await expect(this.page.getByRole('button', { name: 'Create' })).toBeVisible({ timeout: 10000 });
    }

    /**
     * Creates a new identity with the given name and email.
     */
    async createIdentity(identityName: string) {
        await this.page.getByRole('button', { name: 'Create' }).click();
        await expect(this.page.getByRole('dialog')).toBeVisible({ timeout: 2000 });
        await this.page.getByRole('textbox', { name: /Identity Name/i }).fill(identityName);
        await this.page.getByRole('button', { name: /Create Identity/i }).click();
        await expect(this.page.locator('tbody')).toContainText(identityName, { timeout: 2000 });
    }
}
