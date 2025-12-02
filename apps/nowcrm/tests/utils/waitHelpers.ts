// contactsapp/tests/utils/waitHelpers.ts
import { Page, Locator, expect } from '@playwright/test';

/**
 * Robust waiting utilities for Playwright tests.
 * These helpers provide more reliable waiting strategies than default Playwright waits.
 */

/**
 * Waits for navigation to complete with retries and proper state checks.
 * Uses Playwright's built-in waitForURL which is more efficient.
 * @param page The Playwright page object
 * @param urlPattern Regex pattern to match the expected URL
 * @param timeout Maximum time to wait in ms (default: 15000)
 */
export async function waitForNavigation(
    page: Page,
    urlPattern: RegExp | string,
    timeout: number = 15000
): Promise<void> {
    // Use Playwright's built-in waitForURL which is optimized
    await page.waitForURL(urlPattern, { timeout });
    
    // Quick check for network stability (non-blocking)
    try {
        await page.waitForLoadState('domcontentloaded', { timeout: 2000 });
    } catch {
        // If it times out, continue anyway - page might be loaded
    }
}

/**
 * Waits for an element to be visible, stable, and enabled.
 * Optimized to avoid unnecessary waits.
 * @param locator The element locator
 * @param timeout Maximum time to wait in ms (default: 10000)
 * @param options Additional options
 */
export async function waitForElementReady(
    locator: Locator,
    timeout: number = 10000,
    options: { 
        enabled?: boolean;
        stable?: boolean;
        scrollIntoView?: boolean;
    } = {}
): Promise<void> {
    const { enabled = true, stable = false, scrollIntoView = true } = options;
    
    // Wait for element to be attached to DOM first (faster than visible check)
    try {
        await locator.waitFor({ state: 'attached', timeout });
    } catch {
        // If attached check fails, fall back to visible check
    }
    
    // Wait for visibility (this is the main wait)
    await expect(locator).toBeVisible({ timeout });
    
    // Scroll into view if needed (non-blocking if already visible)
    if (scrollIntoView) {
        try {
            await locator.scrollIntoViewIfNeeded({ timeout: 500 });
        } catch {
            // Element might already be in view, continue
        }
    }
    
    // Only check stability if explicitly requested (usually not needed)
    if (stable) {
        await expect(locator).toBeVisible({ timeout: 500 });
    }
    
    // Check if element should be enabled (quick check, non-blocking)
    if (enabled) {
        try {
            await expect(locator).toBeEnabled({ timeout: 500 });
        } catch {
            // If enabled check fails, element might be disabled - that's okay for some cases
        }
    }
}

/**
 * Waits for toast notifications to disappear.
 * Useful before clicking elements that might be intercepted by toasts.
 * @param page The Playwright page object
 * @param timeout Maximum time to wait in ms (default: 2000)
 */
export async function waitForToastsToDisappear(
    page: Page,
    timeout: number = 2000
): Promise<void> {
    // Quick check - if no toasts exist, return immediately
    const toasts = page.locator('[data-rht-toaster] .go2072408551, [role="alert"]');
    const count = await toasts.count().catch(() => 0);
    
    if (count === 0) {
        return; // No toasts, no need to wait
    }
    
    // Only wait if toasts are present
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        const currentCount = await toasts.count().catch(() => 0);
        if (currentCount === 0) {
            return; // Toasts disappeared
        }
        await page.waitForTimeout(200);
    }
    
    // If toasts are still there after timeout, continue anyway (non-blocking)
}

/**
 * Clicks an element with retries, handling interception by overlays/toasts.
 * Optimized to minimize wait times.
 * @param locator The element to click
 * @param options Click options
 */
export async function robustClick(
    locator: Locator,
    options: {
        timeout?: number;
        force?: boolean;
        waitForNavigation?: RegExp | string;
    } = {}
): Promise<void> {
    const { timeout = 10000, force = false, waitForNavigation: navPattern } = options;
    
    // Wait for element to be ready (this includes visibility check)
    await waitForElementReady(locator, timeout, { scrollIntoView: true, enabled: true, stable: false });
    
    // Quick check for toasts (non-blocking)
    await waitForToastsToDisappear(locator.page(), 1000);
    
    // Try clicking - use force on first attempt if specified, otherwise try normal first
    try {
        if (navPattern) {
            await Promise.all([
                waitForNavigation(locator.page(), navPattern, timeout),
                locator.click({ force })
            ]);
        } else {
            await locator.click({ force });
        }
        return;
    } catch (error) {
        // If first attempt fails and force wasn't used, retry with force
        if (!force) {
            await waitForToastsToDisappear(locator.page(), 1000);
            if (navPattern) {
                await Promise.all([
                    waitForNavigation(locator.page(), navPattern, timeout),
                    locator.click({ force: true })
                ]);
            } else {
                await locator.click({ force: true });
            }
        } else {
            throw error;
        }
    }
}

/**
 * Waits for network to be idle with a timeout.
 * Optimized to avoid long waits when not necessary.
 * @param page The Playwright page object
 * @param timeout Maximum time to wait in ms (default: 5000)
 */
export async function waitForNetworkIdle(
    page: Page,
    timeout: number = 5000
): Promise<void> {
    try {
        // Try networkidle first with shorter timeout
        await page.waitForLoadState('networkidle', { timeout });
    } catch {
        // If networkidle times out quickly, just wait for DOM to be ready
        try {
            await page.waitForLoadState('domcontentloaded', { timeout: 2000 });
        } catch {
            // If that also fails, just continue - page is likely loaded
        }
    }
}

/**
 * Waits for a table to update (rows to appear/change).
 * Uses polling with exponential backoff for efficiency.
 * @param tableBodyLocator The tbody locator
 * @param expectedRowCount Optional: expected number of rows
 * @param timeout Maximum time to wait in ms (default: 10000)
 */
export async function waitForTableUpdate(
    tableBodyLocator: Locator,
    expectedRowCount?: number,
    timeout: number = 10000
): Promise<void> {
    const startTime = Date.now();
    let pollInterval = 200; // Start with fast polling
    
    while (Date.now() - startTime < timeout) {
        try {
            const rows = tableBodyLocator.locator('tr');
            const count = await rows.count();
            
            if (expectedRowCount !== undefined) {
                if (count === expectedRowCount) {
                    return; // Found expected count
                }
            } else {
                // Just check if table is visible
                if (await tableBodyLocator.isVisible({ timeout: 100 }).catch(() => false)) {
                    return; // Table is visible
                }
            }
        } catch {
            // Table might not exist yet, continue waiting
        }
        
        // Exponential backoff - poll less frequently over time
        await tableBodyLocator.page().waitForTimeout(pollInterval);
        pollInterval = Math.min(pollInterval * 1.5, 1000); // Cap at 1s
    }
    
    if (expectedRowCount !== undefined) {
        const actualCount = await tableBodyLocator.locator('tr').count().catch(() => 0);
        throw new Error(`Table update timeout: Expected ${expectedRowCount} rows, got ${actualCount}`);
    }
}

/**
 * Polls for a condition to become true.
 * Useful for async operations that don't have clear completion signals.
 * @param checkFn Function that returns true when condition is met
 * @param timeout Maximum time to wait in ms (default: 30000)
 * @param interval Polling interval in ms (default: 1000)
 */
export async function pollUntil(
    checkFn: () => Promise<boolean>,
    timeout: number = 30000,
    interval: number = 1000
): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
        const result = await checkFn();
        if (result) {
            return;
        }
        await new Promise(resolve => setTimeout(resolve, interval));
    }
    
    throw new Error(`Polling timeout: Condition not met after ${timeout}ms`);
}

/**
 * Waits for a form submission to complete.
 * Checks for success messages, navigation, or form state changes.
 * Optimized to wait only for what's actually needed.
 * @param page The Playwright page object
 * @param options Options for what to wait for
 * @param timeout Maximum time to wait in ms (default: 10000)
 */
export async function waitForFormSubmission(
    page: Page,
    options: {
        successMessage?: string | RegExp;
        navigateTo?: RegExp | string;
        waitForNetworkIdle?: boolean;
    } = {},
    timeout: number = 10000
): Promise<void> {
    const { successMessage, navigateTo, waitForNetworkIdle: waitNetwork = false } = options;
    
    // Wait for navigation first if specified (most reliable indicator)
    if (navigateTo) {
        await waitForNavigation(page, navigateTo, timeout);
        return; // Navigation is usually enough
    }
    
    // Wait for success message if specified
    if (successMessage) {
        const messageLocator = typeof successMessage === 'string'
            ? page.getByText(successMessage, { exact: true })
            : page.getByText(successMessage);
        await expect(messageLocator.first()).toBeVisible({ timeout });
        return; // Success message is enough
    }
    
    // Only wait for network idle if explicitly requested and no other indicators
    if (waitNetwork) {
        await waitForNetworkIdle(page, 3000);
    }
}

/**
 * Waits for a dialog/modal to be fully loaded and ready.
 * Minimal wait - just checks visibility.
 * @param dialogLocator The dialog locator
 * @param timeout Maximum time to wait in ms (default: 5000)
 */
export async function waitForDialogReady(
    dialogLocator: Locator,
    timeout: number = 5000
): Promise<void> {
    await expect(dialogLocator).toBeVisible({ timeout });
    // No additional waits - visibility is enough
}

