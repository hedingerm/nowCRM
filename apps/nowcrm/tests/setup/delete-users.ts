import { APIRequestContext } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../..', '.env') });

const adminLoginUrl = 'http://localhost:1337/admin/login';
const usersUrl = 'http://localhost:1337/content-manager/collection-types/plugin::users-permissions.user';

export async function deleteUserFromStrapi(request: APIRequestContext, email: string) {
    // 1. Admin login with retry logic for rate limits
    const ADMIN_CREDENTIALS = {
        email: process.env.STRAPI_TEST_ADMIN_EMAIL || 'strapiadmin@example.com',
        password: process.env.STRAPI_TEST_ADMIN_PASSWORD || 'StrongPassword123!',
    };

    let loginResponse;
    const maxRetries = 3;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
        loginResponse = await request.post(adminLoginUrl, {
            headers: { 'Content-Type': 'application/json' },
            data: ADMIN_CREDENTIALS,
            failOnStatusCode: false
        });

        if (loginResponse.ok()) {
            break; // Success, exit retry loop
        }
        
        // Check if it's a rate limit error
        if (loginResponse.status() === 429 && retryCount < maxRetries - 1) {
            retryCount++;
            const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff: 2s, 4s, 8s
            console.log(`Rate limit hit in deleteUserFromStrapi, waiting ${waitTime}ms before retry ${retryCount}/${maxRetries}...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
        }
        
        // Not a rate limit or max retries reached
        throw new Error(`Admin login failed: ${await loginResponse.text()}`);
    }

    const loginBody = await loginResponse.json();
    const adminJwt = loginBody.data?.token;
    if (!adminJwt) throw new Error('Admin JWT token missing in login response.');

    // 2. Find user by email
    const usersResponse = await request.get(`${usersUrl}?filters[email][$eq]=${encodeURIComponent(email)}`, {
        headers: { Authorization: `Bearer ${adminJwt}` }
    });

    if (!usersResponse.ok()) {
        throw new Error(`Failed to fetch users: ${await usersResponse.text()}`);
    }

    const usersBody = await usersResponse.json();
    const user = usersBody.results?.[0] || usersBody.data?.[0];
    if (!user || !user.id) {
        console.warn(`User with email ${email} not found, nothing to delete.`);
        return;
    }

    // 3. Delete user by id
    const deleteResponse = await request.delete(`${usersUrl}/${user.id}`, {
        headers: { Authorization: `Bearer ${adminJwt}` },
        failOnStatusCode: false
    });

    if (!deleteResponse.ok()) {
        // If user is already deleted (404), that's fine
        if (deleteResponse.status() === 404) {
            console.log(`User with email ${email} was already deleted or not found.`);
            return;
        }
        throw new Error(`Failed to delete user: ${await deleteResponse.text()}`);
    }

    console.log(`User with email ${email} deleted successfully.`);
}