import { test, expect } from '@playwright/test';
import { ImportPage } from './pages/ImportPage';
import { loginUser } from './utils/authHelper';
import fs from 'fs';
import path from 'path';
import { generateOrganizationsCsv } from './files/generate-organizations';

// Helper to generate CSV file dynamically using TypeScript script
async function generateOrganizationsCsvFile(filename: string, count: number): Promise<string> {
    const filesDir = path.resolve(__dirname, 'files');
    const filePath = path.resolve(filesDir, filename);
    generateOrganizationsCsv(filename, count, filesDir);
    if (!fs.existsSync(filePath)) {
        throw new Error(`CSV file was not generated: ${filePath}`);
    }
    return filePath;
}

test.describe('CSV Import - Organizations', () => {
    let importPage: ImportPage;

    test.beforeEach(async ({ page }) => {
        importPage = new ImportPage(page);
        await loginUser(page);
        await importPage.gotoImportOrganizations();
    });

    test('User should be able to import a valid 10 organization CSV file', async ({ page }) => {
        const orgCount = 10;
        const csvFileName = `organizations_${orgCount}_uniq.csv`;
        await generateOrganizationsCsvFile(csvFileName, orgCount);
    await importPage.selectFileAndConfigureOrganizations(csvFileName);
    await importPage.selectRequiredColumnsForOrganizations('email');
    await importPage.submitImport();
    await importPage.expectSuccessStatusMessageContains('CSV import started!');
    });

    test('User should be able to import a valid 100 organization CSV file', async ({ page }) => {
        const orgCount = 100;
        const csvFileName = `organizations_${orgCount}_uniq.csv`;
        await generateOrganizationsCsvFile(csvFileName, orgCount);
    await importPage.selectFileAndConfigureOrganizations(csvFileName);
        await importPage.selectRequiredColumnsForOrganizations('email');
        await importPage.submitImport();
        await importPage.expectSuccessStatusMessageContains('CSV import started!');
    });

    test('User should be able to import a valid 1000 organization CSV file', async ({ page }) => {
        const orgCount = 1000;
        const csvFileName = `organizations_${orgCount}_uniq.csv`;
        await generateOrganizationsCsvFile(csvFileName, orgCount);
    await importPage.selectFileAndConfigureOrganizations(csvFileName);
        await importPage.selectRequiredColumnsForOrganizations('email');
        await importPage.submitImport();
        await importPage.expectSuccessStatusMessageContains('CSV import started!');
    });

    // Large file imports are skipped by default for performance reasons
    test.skip('User should be able to import a valid 10,000 organization CSV file', async ({ page }) => {
        const orgCount = 10000;
        const csvFileName = `organizations_${orgCount}_uniq.csv`;
        await generateOrganizationsCsvFile(csvFileName, orgCount);
    await importPage.selectFileAndConfigureOrganizations(csvFileName);
        await importPage.selectRequiredColumnsForOrganizations('email');
        await importPage.submitImport();
        await importPage.expectSuccessStatusMessageContains('CSV import started!');
    });

    test.skip('User should be able to import a valid 100,000 organization CSV file', async ({ page }) => {
        const orgCount = 100000;
        const csvFileName = `organizations_${orgCount}_uniq.csv`;
        await generateOrganizationsCsvFile(csvFileName, orgCount);
    await importPage.selectFileAndConfigureOrganizations(csvFileName);
        await importPage.selectRequiredColumnsForOrganizations('email');
        await importPage.submitImport();
        await importPage.expectSuccessStatusMessageContains('CSV import started!');
    });

    test.skip('User should be able to import a valid 1,000,000 organization CSV file', async ({ page }) => {
        const orgCount = 1000000;
        const csvFileName = `organizations_${orgCount}_uniq.csv`;
        await generateOrganizationsCsvFile(csvFileName, orgCount);
    await importPage.selectFileAndConfigureOrganizations(csvFileName);
        await importPage.selectRequiredColumnsForOrganizations('email');
        await importPage.submitImport();
        await importPage.expectSuccessStatusMessageContains('CSV import started!');
    });

    // Negative Test Case: Uploading an invalid file type
    test.skip('User should see an error when uploading an invalid file type (e.g., .txt)', async ({ page }) => {
        const invalidFileName = 'invalid_upload_test.txt';
        await importPage.selectFileAndConfigure(invalidFileName);
        await importPage.selectRequiredColumns('email');
        await importPage.submitImport();
        await importPage.expectUploadFailedErrorVisible();
        await expect(importPage.successStatusLocator, 'CSV import started!').not.toBeVisible();
    });

    test('User should NOT be able to import when no required fields are selected', async ({ page }) => {
        const orgCount = 10;
        const csvFileName = `organizations_${orgCount}_uniq.csv`;
        await generateOrganizationsCsvFile(csvFileName, orgCount);
        await importPage.selectFileAndConfigure(csvFileName);
        await expect(importPage.importSubmitButton).toBeDisabled();
    });
});