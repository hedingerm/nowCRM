// contactsapp/tests/pages/ContactsListPage.ts
import { type Locator, type Page, expect } from '@playwright/test';

export class ContactsListPage {
    readonly page: Page;

    // Locators
    readonly createButton: Locator;
    readonly contactsTable: Locator;
    readonly filterInput: Locator;
    readonly selectAllCheckbox: Locator;
    readonly massActionsButton: Locator;
    readonly deleteMassActionMenuItem: Locator;
    readonly confirmDeleteMassAction: Locator;
    readonly addToListMassActionMenuItem: Locator;

    constructor(page: Page) {
        this.page = page;
        // Use a more specific selector - the Create button has data-slot="dialog-trigger"
        this.createButton = page.locator('button[data-slot="dialog-trigger"]').filter({ hasText: 'Create' }).first();
        this.contactsTable = page.locator('table'); // Adjust if more specific selector needed
    // Try to find filter input by role, label, or placeholder
    const filterByRole = page.getByRole('textbox', { name: 'Filter Contacts...' });
    this.filterInput = filterByRole;
        this.selectAllCheckbox = page.getByRole('checkbox', { name: 'Select all' });
        this.massActionsButton = page.getByRole('button', { name: 'Mass Actions' });
        this.deleteMassActionMenuItem = page.getByRole('menuitem', { name: 'Delete' });
        this.confirmDeleteMassAction = page.getByRole('button', { name: 'Delete' });
        this.addToListMassActionMenuItem = page.getByRole('menuitem', { name: 'Add to list' });
    }

    // Actions
    async goto() {
        await this.page.goto('/en/crm/contacts');
        await expect(this.createButton, 'Create button should be visible on Contacts page').toBeVisible({ timeout: 20000 });
    }

    async clickCreateButton() {
        await this.createButton.click();
    }

    async filterContacts(searchTerm: string) {
        // Try to find the filter/search input - it should be outside the table/form area
        // Look for input with placeholder containing "Search" or "Filter"
        const filterByPlaceholder = this.page.getByPlaceholder(/Search.*Contact/i).or(this.page.getByPlaceholder(/Filter.*Contact/i));
        
        if (await filterByPlaceholder.isVisible().catch(() => false)) {
            await filterByPlaceholder.fill(searchTerm);
        } else {
            // Try by role with name containing "Search" or "Filter"
            const filterByRole = this.page.getByRole('textbox', { name: /Search|Filter/i });
            if (await filterByRole.first().isVisible().catch(() => false)) {
                await filterByRole.first().fill(searchTerm);
            } else {
                // Last resort: find input that's not inside a dialog or form with name/email fields
                const allTextboxes = this.page.getByRole('textbox');
                const count = await allTextboxes.count();
                // The filter is usually one of the first textboxes, but not in a dialog
                for (let i = 0; i < Math.min(count, 5); i++) {
                    const tb = allTextboxes.nth(i);
                    const placeholder = await tb.getAttribute('placeholder').catch(() => '');
                    if (placeholder && (placeholder.toLowerCase().includes('search') || placeholder.toLowerCase().includes('filter'))) {
                        await tb.fill(searchTerm);
                        await this.page.waitForTimeout(300);
                        return;
                    }
                }
                throw new Error('Could not find filter input for contacts');
            }
        }
        // Add small wait or check for results if filtering is async
        await this.page.waitForTimeout(300);
    }

    async checkSelectAll() {
        await this.selectAllCheckbox.check();
    }

    async openMassActionsMenu() {
        await this.massActionsButton.click();
        // Wait for menu to appear, check for a common item like delete
        await expect(this.deleteMassActionMenuItem, 'Mass actions menu should appear').toBeVisible({ timeout: 5000 });
    }

    async clickDeleteMassAction() {
        await this.deleteMassActionMenuItem.click();
        // Add confirmation handling if needed
    }

    async clickDeleteConfirmMassAction() {
        await this.confirmDeleteMassAction.click();
        // Add confirmation handling if needed
    }

    async clickAddToListMassAction() {
        await this.addToListMassActionMenuItem.click();
    }

    async openContactByEmail(email: string): Promise<void> {
        await this.filterContacts(email);
        const row = this.getRowLocator(email);
        await expect(row, `Contact row with email "${email}" should be visible`).toBeVisible({ timeout: 5000 });

        // Click the row menu button (kebab/menu, id starts with radix-)
        const menuButton = row.locator('button[id^="radix-"]');
        await expect(menuButton).toBeVisible({ timeout: 5000 });
        await menuButton.click();

        // Click "View" in the menu
        const viewMenuItem = this.page.getByRole('menuitem', { name: 'View' });
        await expect(viewMenuItem).toBeVisible({ timeout: 3000 });
        // Wait for menu to be stable before clicking
        await this.page.waitForTimeout(200);
        await viewMenuItem.click({ force: true });

        // Wait for the details page to load - contact IDs can be alphanumeric
        await expect(this.page).toHaveURL(/\/contacts\/[^\/]+\/details/, { timeout: 10000 });
    }

    /**
     * Verifies that a contact row is anonymized: first/last name empty, email starts with "deleted+"
     */
    async expectContactRowAnonymized(): Promise<void> {
        // Find the row by the anonymized email (starts with "deleted+" and ends with @example.com)
        const deletedEmailPattern = new RegExp(`^deleted\\+.*@example\\.com$`, 'i');
        const row = this.page.locator('table tbody tr').filter({
            has: this.page.locator('td').nth(3).filter({ hasText: deletedEmailPattern })
        }).first();

        await expect(row).toBeVisible({ timeout: 10000 });

        const cells = row.locator('td');
        const firstNameCell = cells.nth(1);
        const lastNameCell = cells.nth(2);
        const emailCell = cells.nth(3);

        await expect(firstNameCell).toHaveText('');
        await expect(lastNameCell).toHaveText('');
        const emailText = await emailCell.textContent();
        expect(emailText?.toLowerCase()).toMatch(/^deleted\+/);
    }

    // Row Helpers
    getRowLocator(uniqueText: string): Locator {
        // Uses email or other unique text to find the row
        return this.contactsTable.locator('tbody tr').filter({ hasText: uniqueText });
    }

    getCheckboxForRow(rowLocator: Locator): Locator {
        // Assuming checkbox is the first element or has specific role/label
        // Original test used: page.getByRole('row', { name: `Select row ${fullName}` }).getByRole('checkbox')
        // Let's make it relative to the row locator
        return rowLocator.locator('td').first().getByRole('checkbox');
    }

    getLinkForRow(rowLocator: Locator, linkText: string): Locator {
        // Use first() to handle multiple links - prefer the one that's likely the name link
        return rowLocator.getByRole('link', { name: linkText }).first();
    }

    getDeleteButtonForRow(rowLocator: Locator): Locator {
        // Original test used: contactRowLocatorByName.locator('td').last().getByRole('button');
        return rowLocator.locator('td').last().getByRole('button'); // Assumes delete is last button in last cell
    }
}
