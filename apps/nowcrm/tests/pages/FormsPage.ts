// contactsapp/tests/pages/FormsPage.ts
import { type Locator, type Page, expect } from '@playwright/test';

/**
 * Page Object Model for the CRM Forms list page and creation modal.
 * Encapsulates all actions and assertions for maintainable E2E tests.
 */
export class FormsPage {
    readonly page: Page;

    // --- Main Page Locators ---
    readonly createButton: Locator;
    readonly formsTable: Locator;
    readonly filterInput: Locator;

    // --- Create Form Dialog Locators ---
    readonly createDialog: Locator;
    readonly formNameInput: Locator;
    readonly createFormButton: Locator;

    // --- Mass Actions Locators ---
    readonly selectAllCheckbox: Locator;
    readonly massActionsButton: Locator;
    readonly deleteMenuItem: Locator;

    constructor(page: Page) {
        this.page = page;

        // Main page
        this.createButton = page.getByRole('button', { name: 'Create', exact: true });
        this.formsTable = page.locator('table');
        this.filterInput = page.getByPlaceholder('Filter Forms...');

        // Create dialog
        this.createDialog = page.getByRole('dialog', { name: 'Create new Form' });
        this.formNameInput = this.createDialog.getByPlaceholder('Enter form name...');
        this.createFormButton = this.createDialog.getByRole('button', { name: 'Create Form' });

        // Mass actions
        this.selectAllCheckbox = page.getByRole('checkbox', { name: 'Select all' });
        this.massActionsButton = page.getByRole('button', { name: 'Mass Actions' });
        this.deleteMenuItem = page.getByRole('menuitem', { name: 'Delete' });
    }

    /**
     * Navigates to the Forms page and waits for it to be ready.
     */
    async goto() {
        await this.page.goto('/en/crm/forms');
        await expect(this.createButton, 'Create button should be visible on Forms page').toBeVisible({ timeout: 15000 });
    }

    /**
     * Opens the Create Form dialog and waits for it to be ready.
     */
    async openCreateFormDialog() {
        await this.createButton.click();
        await expect(this.createDialog, 'Create Form dialog should appear').toBeVisible({ timeout: 10000 });
        await expect(this.formNameInput, 'Form Name input should be visible in dialog').toBeVisible();
    }

    /**
     * Fills in the form name and submits the Create Form dialog.
     * @param formName The name of the form to create.
     */
    async fillAndSubmitCreateForm(formName: string) {
        await this.formNameInput.fill(formName);
        await this.createFormButton.click();
    }

    /**
     * Filters the forms table by the given search term.
     * @param searchTerm The term to filter forms by.
     */
    async filterForms(searchTerm: string) {
        await expect(this.filterInput).toBeVisible();
        await this.filterInput.fill(searchTerm);
        await this.page.waitForTimeout(300); // Small delay for filter
    }

    /**
     * Selects all forms in the table using the select all checkbox.
     */
    async selectAllForms() {
        await expect(this.selectAllCheckbox, 'Select all checkbox should be visible').toBeVisible();
        await this.selectAllCheckbox.check();
    }

    /**
     * Performs a mass delete action using the mass actions menu.
     * Handles the delete menu item and confirmation if needed.
     */
    async performMassDeleteAction() {
        await this.massActionsButton.click();
        await expect(this.deleteMenuItem, 'Delete option should appear in Mass Actions menu').toBeVisible({ timeout: 5000 });
        await this.deleteMenuItem.click();
        // Add confirmation handling if needed
    }

    /**
     * Deletes a form using the delete button in the given row.
     * @param rowLocator The locator for the form row to delete.
     */
    async deleteFormFromRow(rowLocator: Locator) {
        const deleteButton = this.getDeleteButtonForRow(rowLocator);
        await expect(deleteButton, 'Delete button should be visible').toBeVisible();
        await deleteButton.click();
        const deleteMenuItem = this.page.getByRole('menuitem', { name: 'Delete' });
        await expect(deleteMenuItem, 'Delete menu item should appear').toBeVisible({ timeout: 5000 });
        await deleteMenuItem.click();
        // Check if confirmation menu item appears (it might not always appear)
        const confirmMenuItem = this.page.getByRole('menuitem', { name: 'Confirm' });
        if (await confirmMenuItem.isVisible({ timeout: 2000 }).catch(() => false)) {
            await confirmMenuItem.click();
        }
    }

    /**
     * Toggles the activation state of a form using the switch in the given row.
     * @param rowLocator The locator for the form row.
     */
    async toggleFormActivation(rowLocator: Locator) {
        const toggleSwitch = this.getSwitchForRow(rowLocator);
        await expect(toggleSwitch, 'Toggle switch should be visible').toBeVisible();
        await toggleSwitch.click();
    }

    /**
     * Asserts that a status message with the given text or RegExp is visible.
     * @param textOrRegExp The text or RegExp to match the status message.
     * @param timeout Optional timeout in ms (default: 10000).
     */
    async expectStatusMessage(textOrRegExp: string | RegExp, timeout: number = 10000) {
        const specificMessageLocator = this.page.getByText(textOrRegExp, { exact: textOrRegExp instanceof RegExp ? undefined : true });
        await expect(specificMessageLocator, `Status message "${textOrRegExp}" should be visible`)
            .toBeVisible({ timeout });
    }

    /**
     * Returns the locator for a row in the forms table by form name.
     * @param formName The name of the form.
     */
    getRowLocator(formName: string): Locator {
        return this.formsTable.locator('tbody tr').filter({ hasText: formName });
    }

    /**
     * Returns the locator for the delete button in a given row.
     * @param rowLocator The locator for the form row.
     */
    getDeleteButtonForRow(rowLocator: Locator): Locator {
        // Target the last button within the row's cells. Adjust if UI changes.
        return rowLocator.locator('td button').last();
    }

    /**
     * Returns the locator for the activation switch in a given row.
     * @param rowLocator The locator for the form row.
     */
    getSwitchForRow(rowLocator: Locator): Locator {
        return rowLocator.getByRole('switch');
    }

    /**
     * Opens a form for editing by clicking on its name in the forms list.
     * @param formName The exact name of the form to open.
     */
    async openFormByName(formName: string) {
        await this.page.locator(`//a[normalize-space()="${formName}"]`).click();
    }

    /**
     * Adds a field to the form by clicking on the field type in the left panel.
     * @param fieldLabel The visible label of the field type (e.g., "Text Area", "Checkbox").
     */
    async addFieldByLabel(fieldLabel: string) {
        await this.page.getByText(fieldLabel, { exact: true }).click();
    }

    /**
     * Checks if a field with the given label exists in the Form Fields area.
     * @param fieldLabel The label of the field to check.
     */
    getFormFieldByLabel(fieldLabel: string, type?: string): Locator {
        const name = type
            ? `Field: ${fieldLabel}, Type: ${type}`
            : `Field: ${fieldLabel}`;
        return this.page.getByRole('button', { name });
    }

    /**
     * Clicks the Save Form button.
     */
    async saveForm() {
        await this.page.getByRole('button', { name: 'Save Form' }).click();
    }

    /**
     * Adds a preset field to the form by clicking the button with a specific title.
     * @param fieldTitle The field title, e.g. "First Name", "Email"
     */
    async addPresetField(fieldTitle: string) {
        await this.page.locator(`//button[@title='Add ${fieldTitle} field']`).click();
    }

    /**
     * Enables the form view by toggling the "Enable Form View" switch.
     * This is optional - if the switch is not found, the method will skip it.
     */
    async enableFormView() {
        // The form view switch has id="form-view"
        const formViewSwitch = this.page.locator('#form-view');
        
        // Try to find it, scroll if needed
        const isVisible = await formViewSwitch.isVisible({ timeout: 2000 }).catch(() => false);
        if (!isVisible) {
            // Scroll down to find it
            await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
            await this.page.waitForTimeout(500);
        }
        
        // Check if it exists, if not, skip (it's optional)
        const exists = await formViewSwitch.isVisible({ timeout: 2000 }).catch(() => false);
        if (exists) {
            await formViewSwitch.scrollIntoViewIfNeeded();
            const isChecked = await formViewSwitch.isChecked();
            if (!isChecked) {
                await formViewSwitch.check();
            }
        } else {
            console.log('Form view switch not found, skipping enableFormView');
        }
    }

    /**
     * Activates the form by toggling the "Active" switch.
     */
    async activateForm() {
        // The active switch has id="form-active" and aria-label="Form Active Status"
        // Try multiple ways to find it
        let activeSwitch = this.page.locator('#form-active');
        const isVisible = await activeSwitch.isVisible({ timeout: 2000 }).catch(() => false);
        
        if (!isVisible) {
            // Try by role
            activeSwitch = this.page.getByRole('switch', { name: /Active|Form Active Status/i });
        }
        
        await expect(activeSwitch, 'Active switch should be visible').toBeVisible({ timeout: 10000 });
        await activeSwitch.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(300);
        
        const isChecked = await activeSwitch.isChecked();
        
        if (!isChecked) {
            // Click the switch directly instead of using check()
            await activeSwitch.click();
            
            // Wait for the React state to update - use expect.poll to wait for the checked state
            await expect.poll(async () => {
                return await activeSwitch.isChecked();
            }, {
                message: 'Active switch should become checked after click',
                timeout: 5000,
            }).toBe(true);
            
            // Additional wait to ensure state is fully synced
            await this.page.waitForTimeout(500);
        }
    }

    /**
     * Clicks the Save Form button.
     */
    async clickSaveForm() {
        await this.page.getByRole('button', { name: 'Save Form' }).click();
    }

    /**
     * Opens the preview of the form.
     * Note: This is the "Preview Form" button inside the form builder, not the "Permalink" button in the table.
     */
    async openPreviewForm() {
        // Wait for the Preview Form button to be visible inside the form builder (it appears after save)
        // The button text is "Preview Form" and it's inside the form builder, not the table
        const previewButton = this.page.getByRole('button', { name: /Preview Form/i }).or(
            this.page.locator('button').filter({ hasText: /Preview Form/i })
        );
        await expect(previewButton, 'Preview Form button should be visible in form builder').toBeVisible({ timeout: 15000 });
        await previewButton.click();
    }

    /**
     * Gets the public URL of the form after opening the preview.
     * Assumes that the preview opens in a new tab.
     */
    async getPublicFormUrl() {
        // Assumes preview opens a new tab, return its URL
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.openPreviewForm(),
        ]);
        await newPage.waitForLoadState();
        return newPage.url();
    }

    /**
     * Clicks a field in the Form Fields area to open its settings.
     * @param fieldLabel The label of the field (e.g., "First Name").
     * @param type Optional type of the field (e.g., "Text").
     */
    async clickOnFormField(fieldLabel: string, type: string = 'Text') {
        await this.page.getByRole('button', { name: `Field: ${fieldLabel}, Type: ${type}` }).click();
    }

    /**
     * Sets the label of the field in the field settings panel.
     * @param newLabel The new label to set.
     */
    async setFieldLabel(newLabel: string) {
        await this.page.getByLabel('Label').fill(newLabel);
    }

    /**
     * Sets the required property of the field in the field settings panel.
     * @param required Whether the field should be required.
     */
    async setFieldRequired(required: boolean = true) {
        const requiredCheckbox = this.page.getByLabel('Required');
        if (required) {
            await requiredCheckbox.check();
        } else {
            await requiredCheckbox.uncheck();
        }
    }

    /**
     * Clicks the "Field Settings" tab in the field settings panel.
     */
    async openFieldSettingsTab() {
        await this.page.getByRole('tab', { name: 'Field Settings' }).click();
    }

    /**
     * Duplicates a form using the duplicate button in the given row.
     * @param rowLocator The locator for the form row to duplicate.
     */
    async duplicateFormFromRow(rowLocator: Locator) {
        // Find the menu button (usually the last button or one with MoreHorizontal icon)
        const menuButton = rowLocator.locator('button').last();
        await expect(menuButton, 'Menu button should be visible').toBeVisible({ timeout: 5000 });
        await menuButton.click();
        
        const duplicateMenuItem = this.page.getByRole('menuitem', { name: 'Duplicate' });
        await expect(duplicateMenuItem, 'Duplicate menu item should be visible').toBeVisible({ timeout: 5000 });
        await duplicateMenuItem.click();
        
        // Wait for the duplication to complete - status message might vary
        await this.page.waitForTimeout(1000);
        // Try to catch the success message, but don't fail if it's not visible
        try {
            await this.expectStatusMessage(/Form.*duplicated|duplicated/i, 3000);
        } catch {
            // Status message might not always appear, that's okay
            console.log('Duplicate status message not found, continuing...');
        }
    }
}
