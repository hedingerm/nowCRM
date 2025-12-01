// tests/import/05Import.spec.ts
import { test, expect } from '@playwright/test';
import { ImportPage } from './pages/ImportPage';
import { loginUser } from './utils/authHelper';
import fs from 'fs';
import path from 'path';
import { generateContactsCsv } from './files/generate-contacts';

// Helper to generate CSV file dynamically using TypeScript script
async function generateContactsCsvFile(filename: string, count: number): Promise<string> {
    const filesDir = path.resolve(__dirname, 'files');
    const filePath = path.resolve(filesDir, filename);
    generateContactsCsv(filename, count, filesDir);
    if (!fs.existsSync(filePath)) {
        throw new Error(`CSV file was not generated: ${filePath}`);
    }
    return filePath;
}

// Test suite for the CRM Contact Import feature
test.describe('CSV Import - Contacts', () => {
    let importPage: ImportPage;

    test.beforeEach(async ({ page }) => {
        importPage = new ImportPage(page);
        await loginUser(page);
        await importPage.gotoImportContacts();
    });

    test('User should be able to import a valid 10 contact CSV file', async ({ page }) => {
        const contactCount = 10;
        const csvFileName = `contacts_${contactCount}_uniq.csv`;
        await generateContactsCsvFile(csvFileName, contactCount);
        await importPage.selectFileAndConfigureContacts(csvFileName);
        await importPage.selectRequiredColumnsForContacts('email');
        await importPage.submitImport();
        await importPage.expectSuccessStatusMessageContains('CSV import started!');
    });

    test('User should be able to import a valid 100 contact CSV file', async ({ page }) => {
        const contactCount = 100;
        const csvFileName = `contacts_${contactCount}_uniq.csv`;
        await generateContactsCsvFile(csvFileName, contactCount);
        await importPage.selectFileAndConfigureContacts(csvFileName);
        await importPage.selectRequiredColumnsForContacts('email');
        await importPage.submitImport();
        await importPage.expectSuccessStatusMessageContains('CSV import started!');
    });

    test('User should be able to import a valid 1000 contact CSV file', async ({ page }) => {
        const contactCount = 1000;
        const csvFileName = `contacts_${contactCount}_uniq.csv`;
        await generateContactsCsvFile(csvFileName, contactCount);
        await importPage.selectFileAndConfigureContacts(csvFileName);
        await importPage.selectRequiredColumnsForContacts('email');
        await importPage.submitImport();
        await importPage.expectSuccessStatusMessageContains('CSV import started!');
    });

    // Large file imports are skipped by default for performance reasons
    test.skip('User should be able to import a valid 10,000 contact CSV file', async ({ page }) => {
        const contactCount = 10000;
        const csvFileName = `contacts_${contactCount}_uniq.csv`;
        await generateContactsCsvFile(csvFileName, contactCount);
        await importPage.selectFileAndConfigureContacts(csvFileName);
        await importPage.selectRequiredColumnsForContacts('email');
        await importPage.submitImport();
        await importPage.expectSuccessStatusMessageContains('CSV import started!');
    });

    test.skip('User should be able to import a valid 100,000 contact CSV file', async ({ page }) => {
        const contactCount = 100000;
        const csvFileName = `contacts_${contactCount}_uniq.csv`;
        await generateContactsCsvFile(csvFileName, contactCount);
        await importPage.selectFileAndConfigureContacts(csvFileName);
        await importPage.selectRequiredColumnsForContacts('email');
        await importPage.submitImport();
        await importPage.expectSuccessStatusMessageContains('CSV import started!');
    });

    test.skip('User should be able to import a valid 1,000,000 contact CSV file', async ({ page }) => {
        const contactCount = 1000000;
        const csvFileName = `contacts_${contactCount}_uniq.csv`;
        await generateContactsCsvFile(csvFileName, contactCount);
        await importPage.selectFileAndConfigureContacts(csvFileName);
        await importPage.selectRequiredColumnsForContacts('email');
        await importPage.submitImport();
        await importPage.expectSuccessStatusMessageContains('CSV import started!');
    });

    // Negative Test Case: Uploading an invalid file type
    test.skip('User should see an error when uploading an invalid file type (e.g., .txt)', async ({ page }) => {
        const invalidFileName = 'invalid_upload_test.txt';
        await importPage.selectFileAndConfigure(invalidFileName);
        await importPage.submitImport();
        await importPage.expectUploadFailedErrorVisible();
        await expect(importPage.successStatusLocator, 'CSV import started!').not.toBeVisible();
    });

    // Negative Test Case: No required fields selected
    test('User should NOT be able to import when no required fields are selected', async ({ page }) => {
        const contactCount = 10;
        const csvFileName = `contacts_${contactCount}_uniq.csv`;
        await generateContactsCsvFile(csvFileName, contactCount);
        await importPage.selectFileAndConfigureContacts(csvFileName);
        await expect(importPage.importSubmitButton).toBeDisabled();
    });

    test('User can enable email subscription before importing contacts', async ({ page }) => {
        const contactCount = 5;
        const csvFileName = `contacts_${contactCount}_uniq.csv`;
        await generateContactsCsvFile(csvFileName, contactCount);
        await importPage.selectFileAndConfigureContacts(csvFileName);
        await page.getByRole('switch', { name: 'Enable email subscription' }).click();
        await importPage.selectRequiredColumnsForContacts('email');
        await importPage.submitImport();
        await importPage.expectSuccessStatusMessageContains('CSV import started!');
    });
});
