/**
 * Search field configurations for different entities
 * Defines which fields should be searched when a user types in the table search input
 */

export const SEARCH_FIELDS_CONFIG = {
	contacts: ["email", "first_name", "last_name"],
	organizations: ["name", "email"],
} as const;

export type SearchFieldsConfig = typeof SEARCH_FIELDS_CONFIG;

/**
 * Get search fields for an entity
 */
export function getSearchFields(
	entityName: keyof SearchFieldsConfig,
): string[] {
	const fields = SEARCH_FIELDS_CONFIG[entityName];
	return fields ? [...fields] : [];
}
