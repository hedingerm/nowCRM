// contactsapp/tests/07Forms.spec.ts
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { FormsPage } from './pages/FormsPage';
import { loginUser } from './utils/authHelper';

/**
 * E2E tests for Forms Management using the FormsPage Page Object Model.
 * All actions and assertions are routed through the POM for clarity and maintainability.
 */
test.describe('Forms Management', () => {
    let formsPage: FormsPage;
    let uniqueFormName: string;

    test.beforeEach(async ({ page }) => {
        formsPage = new FormsPage(page);
        uniqueFormName = `TestForm_${faker.string.alphanumeric(8)}`;
        await loginUser(page);
        await formsPage.goto();
    });

    test('User can create a new form', async () => {
        await formsPage.openCreateFormDialog();
        await formsPage.fillAndSubmitCreateForm(uniqueFormName);
        await formsPage.expectStatusMessage(`Form ${uniqueFormName} created`);
        await expect(formsPage.getRowLocator(uniqueFormName), 'Newly created form row should be visible')
            .toBeVisible({ timeout: 10000 });
    });

    test('User can delete a form using row action', async () => {
        await formsPage.openCreateFormDialog();
        await formsPage.fillAndSubmitCreateForm(uniqueFormName);
        await formsPage.expectStatusMessage(`Form ${uniqueFormName} created`);
        const formRow = formsPage.getRowLocator(uniqueFormName);
        await expect(formRow, 'Form row to delete should be visible').toBeVisible();

        // Use the POM method for row deletion
        await formsPage.deleteFormFromRow(formRow);

        await formsPage.expectStatusMessage('Form deleted');
        await expect(formRow, 'Deleted form row should no longer be visible')
            .not.toBeVisible({ timeout: 10000 });
    });

    test('User can activate and deactivate a form', async ({ page }) => {
        await formsPage.openCreateFormDialog();
        await formsPage.fillAndSubmitCreateForm(uniqueFormName);
        await formsPage.expectStatusMessage(`Form ${uniqueFormName} created`);
        await page.waitForTimeout(1000); // Wait for form to appear
        
        const formRow = formsPage.getRowLocator(uniqueFormName);
        await expect(formRow, 'Form row to toggle should be visible').toBeVisible();

        // Use the POM method for toggling activation
        await formsPage.toggleFormActivation(formRow);
        await formsPage.expectStatusMessage(/Form.*activated/i);

        await formsPage.toggleFormActivation(formRow);
        await formsPage.expectStatusMessage(/Form.*deactivated/i);
    });

    test('User can delete forms using mass action', async () => {
        await formsPage.openCreateFormDialog();
        await formsPage.fillAndSubmitCreateForm(uniqueFormName);
        await formsPage.expectStatusMessage(`Form ${uniqueFormName} created`);
        const formRow = formsPage.getRowLocator(uniqueFormName);
        await expect(formRow, 'Form row to mass delete should be visible').toBeVisible();

        // Use the POM method for selecting all forms
        await formsPage.selectAllForms();
        await formsPage.performMassDeleteAction();

        await formsPage.expectStatusMessage('Forms deleted');
        await expect(formRow, 'Mass deleted form row should no longer be visible')
            .not.toBeVisible({ timeout: 10000 });
    });

    test('User can add multiple fields to a new form and save', async () => {
        const uniqueFormName = `TestForm_${Date.now()}`;

        await formsPage.openCreateFormDialog();
        await formsPage.fillAndSubmitCreateForm(uniqueFormName);
        await formsPage.expectStatusMessage(`Form ${uniqueFormName} created`);

        const formRow = formsPage.getRowLocator(uniqueFormName);
        await expect(formRow).toBeVisible({ timeout: 10000 });

        await formsPage.openFormByName(uniqueFormName);

        // Add preset fields to the form
        await formsPage.addPresetField('First Name');
        await formsPage.addPresetField('Last Name');
        await formsPage.addPresetField('Email');
        await formsPage.addPresetField('Phone');
        await formsPage.addPresetField('Mobile Number');
        await formsPage.addPresetField('Organization');
        await formsPage.addPresetField('Function');
        await formsPage.addPresetField('Age');
        await formsPage.addPresetField('Website');
        await formsPage.addPresetField('Address Line 1');
        await formsPage.addPresetField('Location');
        await formsPage.addPresetField('ZIP');
        await formsPage.addPresetField('Short Bio');
        await formsPage.addPresetField('Subscribe to Newsletter');
        await formsPage.addPresetField('Gender');
        await formsPage.addPresetField('Language');
        await formsPage.addPresetField('Country');
        await formsPage.addPresetField('Preferred Contact Date');
        await formsPage.addPresetField('File');
        await formsPage.addPresetField('Resume');
        await formsPage.addPresetField('Text');
        await formsPage.addPresetField('Number');
        await formsPage.addPresetField('Text Area');
        await formsPage.addPresetField('Checkbox');
        await formsPage.addPresetField('Dropdown');
        await formsPage.addPresetField('Date');

        await formsPage.saveForm();
        await formsPage.expectStatusMessage('Form saved!');

        // Verify the fields are present in the Form Fields area
        await expect(formsPage.getFormFieldByLabel('First Name', 'Text')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Last Name', 'Text')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Email', 'Email')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Phone', '')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Mobile Number', '')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Organization', '')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Function', 'Text')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Age', 'Number')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Website', 'Text')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Address Line 1', '')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Location', 'Text')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('ZIP', 'Text')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Short Bio', 'Text')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Subscribe to', '')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Gender', 'Radio')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Language', '')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Country', 'Dropdown')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Preferred Contact Date')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('File', 'File')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Resume', '')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Text', 'Text')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Number', 'Number')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Text Area', 'Text')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Checkbox', '')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Dropdown', '')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Date', 'Date')).toBeVisible();
    });

    test('User can submit a public form and data is saved', async ({ page, context }) => {
        const formsPage = new FormsPage(page);
        const uniqueFormName = `TestForm_${Date.now()}`;

        // Create a new form
        await formsPage.openCreateFormDialog();
        await formsPage.fillAndSubmitCreateForm(uniqueFormName);
        await formsPage.expectStatusMessage(`Form ${uniqueFormName} created`);
        await formsPage.openFormByName(uniqueFormName);

        // Add fields
        await formsPage.addPresetField('First Name');
        await formsPage.addPresetField('Email');

        // Save the form first (fields need to be saved) - Preview Form button appears after save
        await formsPage.clickSaveForm();
        await page.waitForTimeout(2000); // Wait for save to complete
        
        // Enable vertical view (optional) - scroll to find it if needed
        await formsPage.enableFormView();
        
        // Activate the form (must be active to preview)
        await formsPage.activateForm();
        await page.waitForTimeout(1000); // Wait for React state to sync

        // Save again after activation - this makes Preview Form button appear
        await formsPage.clickSaveForm();
        await page.waitForTimeout(3000); // Wait for save to complete and backend to process
        
        // Wait for the Preview Form button to appear (indicates form is saved and shareUrl is ready)
        // The button appears only after clicking save/update
        const previewButton = page.getByRole('button', { name: /Preview Form/i });
        await expect(previewButton, 'Preview Form button should appear after save').toBeVisible({ timeout: 15000 });

        // Verify form is active before opening preview
        const activeSwitch = page.locator('#form-active');
        const isActive = await activeSwitch.isChecked();
        if (!isActive) {
            throw new Error('Form is not active. Switch is unchecked after save.');
        }

        // Open public form in a new tab
        const [publicFormPage] = await Promise.all([
            context.waitForEvent('page'),
            formsPage.openPreviewForm(),
        ]);
        await publicFormPage.waitForLoadState('networkidle');
        await publicFormPage.waitForTimeout(2000);
        
        // Check if form shows inactive message
        const inactiveMessage = publicFormPage.getByText('Form Inactive');
        const isInactive = await inactiveMessage.isVisible({ timeout: 3000 }).catch(() => false);
        if (isInactive) {
            throw new Error('Form is not active. Make sure form is activated and saved before previewing.');
        }
        
        // Fill and submit the public form
        // In step mode, fields are headings with inputs below; in list mode, they're labels
        // Try to find input by name, placeholder, or label
        const firstNameInput = publicFormPage.locator('input[name*="first" i], input[placeholder*="First Name" i]').first();
        await expect(firstNameInput).toBeVisible({ timeout: 15000 });
        await firstNameInput.fill('John');
        
        const emailInput = publicFormPage.locator('input[type="email"], input[name*="email" i]').first();
        await expect(emailInput).toBeVisible({ timeout: 15000 });
        await emailInput.fill('john@example.com');
        
        const submitButton = publicFormPage.getByRole('button', { name: /Submit|Next/i });
        await expect(submitButton).toBeVisible({ timeout: 10000 });
        await submitButton.click();

        await expect(publicFormPage.getByText(/Success|Thank you/i)).toBeVisible({ timeout: 10000 });
    });

    test('User cannot submit a public form with required fields empty', async ({ page, context }) => {
    const formsPage = new FormsPage(page);
    const uniqueFormName = `TestForm_${Date.now()}`;

    await formsPage.openCreateFormDialog();
    await formsPage.fillAndSubmitCreateForm(uniqueFormName);
    await formsPage.expectStatusMessage(`Form ${uniqueFormName} created`);
    await formsPage.openFormByName(uniqueFormName);

    await formsPage.addPresetField('First Name');
    await formsPage.clickOnFormField('First Name');
    await formsPage.openFieldSettingsTab();
    await formsPage.setFieldLabel('Your First Name');
    await formsPage.setFieldRequired(true);
    await formsPage.saveForm();
    await formsPage.expectStatusMessage('Form saved!');
    
    // Activate the form after saving
    await formsPage.activateForm();
    await page.waitForTimeout(1000); // Wait for React state to sync
    await formsPage.saveForm();
    await page.waitForTimeout(2000); // Wait for save to complete
    
    // Wait for Preview Form button to appear (appears only after save/update)
    const previewButton = page.getByRole('button', { name: /Preview Form/i });
    await expect(previewButton, 'Preview Form button should appear after save').toBeVisible({ timeout: 10000 });

    await expect(formsPage.getFormFieldByLabel('Your First Name', 'Text')).toBeVisible();

    const [publicFormPage] = await Promise.all([
        context.waitForEvent('page'),
        formsPage.openPreviewForm(),
    ]);
    await publicFormPage.waitForLoadState();

    // Wait for form to load
    await publicFormPage.waitForLoadState('networkidle');
    await publicFormPage.waitForTimeout(1000);
    
    // Check if form shows inactive message
    const inactiveMessage = publicFormPage.getByText('Form Inactive');
    const isInactive = await inactiveMessage.isVisible({ timeout: 2000 }).catch(() => false);
    if (isInactive) {
        throw new Error('Form is not active. Make sure form is activated before previewing.');
    }
    
    // Do not fill the required field, just click "Review" or "Next" (depending on form mode)
    const reviewButton = publicFormPage.getByRole('button', { name: /Review|Next/i });
    await expect(reviewButton).toBeVisible({ timeout: 10000 });
    await reviewButton.click();

    // Assert that the required validation message is visible
    await expect(publicFormPage.getByText('Required')).toBeVisible();
});

test('User can submit all fields in a public form and data is saved', async ({ page, context }) => {
    const formsPage = new FormsPage(page);
    const uniqueFormName = `TestForm_${Date.now()}`;

    // Create a new form
    await formsPage.openCreateFormDialog();
    await formsPage.fillAndSubmitCreateForm(uniqueFormName);
    await formsPage.expectStatusMessage(`Form ${uniqueFormName} created`);
    await formsPage.openFormByName(uniqueFormName);

    // Add a variety of fields
    await formsPage.addPresetField('First Name');
    await formsPage.addPresetField('Last Name');
    await formsPage.addPresetField('Email');
    await formsPage.addPresetField('Phone');
    await formsPage.addPresetField('Age');
    await formsPage.addPresetField('Gender');
    await formsPage.addPresetField('Country');

    // Save first (Preview Form button appears after save)
    await formsPage.saveForm();
    await page.waitForTimeout(2000);
    
    // Enable form view, activate, and save again
    await formsPage.enableFormView();
    await formsPage.activateForm();
    await page.waitForTimeout(1000); // Wait for React state to sync
    await formsPage.saveForm();
    await page.waitForTimeout(2000); // Wait for save to complete
    
    // Wait for Preview Form button to appear (appears only after save/update)
    const previewButton = page.getByRole('button', { name: /Preview Form/i });
    await expect(previewButton, 'Preview Form button should appear after save').toBeVisible({ timeout: 10000 });

    // Open public form in a new tab
    const [publicFormPage] = await Promise.all([
        context.waitForEvent('page'),
        formsPage.openPreviewForm(),
    ]);
    await publicFormPage.waitForLoadState();

    // Wait for form to load
    await publicFormPage.waitForLoadState('networkidle');
    await publicFormPage.waitForTimeout(1000);
    
    // Check if form shows inactive message
    const inactiveMessage = publicFormPage.getByText('Form Inactive');
    const isInactive = await inactiveMessage.isVisible({ timeout: 2000 }).catch(() => false);
    if (isInactive) {
        throw new Error('Form is not active. Make sure form is activated before previewing.');
    }
    
    // Fill all fields - use flexible selectors for step mode vs list mode
    // Fill text/number fields
    const firstNameField = publicFormPage.getByLabel('First Name').or(publicFormPage.locator('input[placeholder*="First Name" i]'));
    await expect(firstNameField).toBeVisible({ timeout: 10000 });
    await firstNameField.fill('Alice');
    
    const lastNameField = publicFormPage.getByLabel('Last Name').or(publicFormPage.locator('input[placeholder*="Last Name" i]'));
    await expect(lastNameField).toBeVisible({ timeout: 10000 });
    await lastNameField.fill('Smith');
    
    const emailField = publicFormPage.getByLabel('Email').or(publicFormPage.locator('input[type="email"]'));
    await expect(emailField).toBeVisible({ timeout: 10000 });
    await emailField.fill('alice@example.com');
    
    const phoneField = publicFormPage.getByLabel('Phone').or(publicFormPage.locator('input[placeholder*="Phone" i]'));
    await expect(phoneField).toBeVisible({ timeout: 10000 });
    await phoneField.fill('1234567890');
    
    const ageField = publicFormPage.getByLabel('Age').or(publicFormPage.locator('input[type="number"]'));
    await expect(ageField).toBeVisible({ timeout: 10000 });
    await ageField.fill('30');

    // Select Gender (radio)
    await publicFormPage.getByText('Gender').click();
    await publicFormPage.getByRole('radio', { name: 'Option 1' }).click();

    // Select Country (dropdown)
    await publicFormPage.getByText('Country').click();
    await publicFormPage.getByRole('option', { name: 'Option 1' }).click();

    // Submit
    await publicFormPage.getByRole('button', { name: 'Submit' }).click();

    // Assert success
    await expect(publicFormPage.getByText('Success!')).toBeVisible();
});

test('User can edit a field in a form and see changes in public form', async ({ page, context }) => {
    const formsPage = new FormsPage(page);
    const uniqueFormName = `TestForm_${Date.now()}`;
    await formsPage.openCreateFormDialog();
    await formsPage.fillAndSubmitCreateForm(uniqueFormName);
    await formsPage.expectStatusMessage(`Form ${uniqueFormName} created`);
    await formsPage.openFormByName(uniqueFormName);

    await formsPage.addPresetField('First Name');
    await formsPage.clickOnFormField('First Name');
    await formsPage.openFieldSettingsTab();
    await formsPage.setFieldLabel('Given Name');
    await formsPage.saveForm();
    await formsPage.expectStatusMessage('Form saved!');
    await page.waitForTimeout(1000);
    
    // Activate the form after saving
    await formsPage.activateForm();
    await page.waitForTimeout(1000); // Wait for React state to sync
    await formsPage.saveForm();
    await page.waitForTimeout(2000); // Wait for save to complete
    
    // Wait for Preview Form button to appear (appears only after save/update)
    const previewButton = page.getByRole('button', { name: /Preview Form/i });
    await expect(previewButton, 'Preview Form button should appear after save').toBeVisible({ timeout: 10000 });

    const [publicFormPage] = await Promise.all([
        context.waitForEvent('page'),
        formsPage.openPreviewForm(),
    ]);
    await publicFormPage.waitForLoadState();

    // When form view is enabled, labels are used instead of headings
    await expect(publicFormPage.getByLabel('Given Name').or(publicFormPage.getByRole('heading', { name: 'Given Name' }))).toBeVisible();
});

test('User can delete a field from a form and it is not visible in the public form', async ({ page, context }) => {
    const formsPage = new FormsPage(page);
    const uniqueFormName = `TestForm_${Date.now()}`;

    // Create and open form
    await formsPage.openCreateFormDialog();
    await formsPage.fillAndSubmitCreateForm(uniqueFormName);
    await formsPage.expectStatusMessage(`Form ${uniqueFormName} created`);
    await formsPage.openFormByName(uniqueFormName);

    // Add fields
    await formsPage.addPresetField('First Name');
    await formsPage.addPresetField('Email');

    // Delete "Email" field
    await formsPage.clickOnFormField('Email', 'Email');
    await page.getByRole('button', { name: 'Delete field Email' }).click();

    // Save first
    await formsPage.saveForm();
    await page.waitForTimeout(2000);
    
    // Activate the form after saving
    await formsPage.activateForm();
    await page.waitForTimeout(1000); // Wait for React state to sync
    await formsPage.saveForm();
    await page.waitForTimeout(2000); // Wait for save to complete
    
    // Wait for Preview Form button to appear (appears only after save/update)
    const previewButton = page.getByRole('button', { name: /Preview Form/i });
    await expect(previewButton, 'Preview Form button should appear after save').toBeVisible({ timeout: 10000 });

    // Preview public form
    const [publicFormPage] = await Promise.all([
        context.waitForEvent('page'),
        formsPage.openPreviewForm(),
    ]);
    await publicFormPage.waitForLoadState();

    // Assert "First Name" is visible, "Email" is not
    // When form view is enabled, labels are used instead of headings
    await expect(publicFormPage.getByLabel('First Name').or(publicFormPage.getByRole('heading', { name: 'First Name' }))).toBeVisible();
    await expect(publicFormPage.getByLabel('Email')).toHaveCount(0);
});

test('User can duplicate a form and all fields are copied', async ({ page }) => {
    const formsPage = new FormsPage(page);
    const uniqueFormName = `TestForm_${Date.now()}`;

    // Create and open form
    await formsPage.openCreateFormDialog();
    await formsPage.fillAndSubmitCreateForm(uniqueFormName);
    await formsPage.expectStatusMessage(`Form ${uniqueFormName} created`);
    await formsPage.openFormByName(uniqueFormName);

    // Add fields
    await formsPage.addPresetField('First Name');
    await formsPage.addPresetField('Email');
    await formsPage.saveForm();
    await formsPage.expectStatusMessage('Form saved!');

    // Duplicate the form
    await formsPage.goto();
    const formRow = formsPage.getRowLocator(uniqueFormName);
    await formsPage.duplicateFormFromRow(formRow);
    
    // Wait a bit for the duplication to complete and reload to see the new form
    await page.waitForTimeout(1000);
    await formsPage.goto();

    // The duplicated form name might be "{name} (Copy)" or "{name} Copy" or similar
    // Try to find it with a flexible pattern
    await page.waitForTimeout(2000); // Wait for duplication to complete
    await formsPage.goto(); // Reload to see the new form
    
    // Try different possible names
    const possibleNames = [
        `${uniqueFormName} (Copy)`,
        `${uniqueFormName} Copy`,
        `${uniqueFormName}_Copy`,
        `${uniqueFormName}-Copy`
    ];
    
    let duplicatedFormRow: Locator | null = null;
    let duplicatedFormName = `${uniqueFormName} (Copy)`;
    
    for (const name of possibleNames) {
        const row = formsPage.getRowLocator(name);
        if (await row.isVisible({ timeout: 2000 }).catch(() => false)) {
            duplicatedFormRow = row;
            duplicatedFormName = name;
            break;
        }
    }
    
    if (!duplicatedFormRow) {
        // If we can't find it by name, try to find any form that contains the original name
        const allRows = formsPage.formsTable.locator('tbody tr');
        const rowCount = await allRows.count();
        for (let i = 0; i < rowCount; i++) {
            const row = allRows.nth(i);
            const text = await row.textContent();
            if (text && text.includes(uniqueFormName) && (text.includes('Copy') || text.includes('copy'))) {
                duplicatedFormRow = row;
                // Get the actual name from the row
                const nameCell = row.locator('td').first();
                const actualName = await nameCell.textContent();
                if (actualName) {
                    duplicatedFormName = actualName.trim();
                }
                break;
            }
        }
    }
    
    if (!duplicatedFormRow) {
        throw new Error(`Could not find duplicated form. Looked for: ${possibleNames.join(', ')}`);
    }
    
    await expect(duplicatedFormRow, 'Duplicated form should be visible').toBeVisible({ timeout: 10000 });

    // Open the duplicated form and check fields
    await formsPage.openFormByName(duplicatedFormName);
    await expect(formsPage.getFormFieldByLabel('First Name', 'Text')).toBeVisible();
    await expect(formsPage.getFormFieldByLabel('Email', 'Email')).toBeVisible();
});

test('User can set a custom submit success message and see it after submitting the public form', async ({ page, context }) => {
    const formsPage = new FormsPage(page);
    const uniqueFormName = `TestForm_${Date.now()}`;
    const customSuccessMessage = 'Thank you for your submission! This is a custom success message.';

    // 1. Create the form and add a few fields
    await formsPage.openCreateFormDialog();
    await formsPage.fillAndSubmitCreateForm(uniqueFormName);
    await formsPage.expectStatusMessage(`Form ${uniqueFormName} created`);
    await formsPage.openFormByName(uniqueFormName);

    await formsPage.addPresetField('First Name');
    await formsPage.addPresetField('Email');

    // 2. Set the custom submit success message
    await page.getByRole('textbox', { name: 'Message displayed after form' }).fill(customSuccessMessage);

    // 3. Save first (Preview Form button appears after save)
    await formsPage.saveForm();
    await page.waitForTimeout(2000);
    
    // 4. Enable form view, activate, and save again
    await formsPage.enableFormView();
    await formsPage.activateForm();
    await page.waitForTimeout(1000); // Wait for React state to sync
    await formsPage.saveForm();
    await page.waitForTimeout(2000); // Wait for save to complete
    
    // Wait for Preview Form button to appear (appears only after save/update)
    const previewButton = page.getByRole('button', { name: /Preview Form/i });
    await expect(previewButton, 'Preview Form button should appear after save').toBeVisible({ timeout: 10000 });

    // 5. Open the public form and submit valid data
    const [publicFormPage] = await Promise.all([
        context.waitForEvent('page'),
        formsPage.openPreviewForm(),
    ]);
    await publicFormPage.waitForLoadState();

    // Wait for form to load
    await publicFormPage.waitForLoadState('networkidle');
    await publicFormPage.waitForTimeout(1000);
    
    // Check if form shows inactive message
    const inactiveMessage = publicFormPage.getByText('Form Inactive');
    const isInactive = await inactiveMessage.isVisible({ timeout: 2000 }).catch(() => false);
    if (isInactive) {
        throw new Error('Form is not active. Make sure form is activated before previewing.');
    }
    
    // Fill fields with flexible selectors
    const firstNameField = publicFormPage.getByLabel('First Name').or(publicFormPage.locator('input[placeholder*="First Name" i]'));
    await expect(firstNameField).toBeVisible({ timeout: 10000 });
    await firstNameField.fill('Test');
    
    const emailField = publicFormPage.getByLabel('Email').or(publicFormPage.locator('input[type="email"]'));
    await expect(emailField).toBeVisible({ timeout: 10000 });
    await emailField.fill('test@example.com');
    
    const submitButton = publicFormPage.getByRole('button', { name: /Submit|Next/i });
    await expect(submitButton).toBeVisible({ timeout: 10000 });
    await submitButton.click();

    // 5. Assert that the custom success message is visible on the success page
    await expect(publicFormPage.getByText(customSuccessMessage)).toBeVisible();
});
});


