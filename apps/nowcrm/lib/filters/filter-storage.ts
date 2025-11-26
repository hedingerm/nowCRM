import type { Session } from "next-auth";

/**
 * Get user-specific localStorage key for filters
 */
export function getFilterStorageKey(
	entityName: string,
	session?: Session | null,
): string {
	const userId = session?.user?.strapi_id || session?.user?.email || "anonymous";
	return `filters.${entityName}.${userId}`;
}

/**
 * Load filters from localStorage
 */
export function loadFiltersFromStorage<T>(
	entityName: string,
	session?: Session | null,
): T | null {
	try {
		const key = getFilterStorageKey(entityName, session);
		const stored = localStorage.getItem(key);
		if (stored) {
			return JSON.parse(stored) as T;
		}
	} catch {
		// Ignore localStorage errors
	}
	return null;
}

/**
 * Save filters to localStorage
 */
export function saveFiltersToStorage<T>(
	entityName: string,
	filters: T,
	session?: Session | null,
): void {
	try {
		const key = getFilterStorageKey(entityName, session);
		localStorage.setItem(key, JSON.stringify(filters));
	} catch {
		// Ignore localStorage errors
	}
}

/**
 * Clear filters from localStorage
 */
export function clearFiltersFromStorage(
	entityName: string,
	session?: Session | null,
): void {
	try {
		const key = getFilterStorageKey(entityName, session);
		localStorage.removeItem(key);
	} catch {
		// Ignore localStorage errors
	}
}

