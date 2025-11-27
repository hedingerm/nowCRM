/**
 * Populate configuration for Organizations table
 * Maps visible columns to relation fields that need to be populated
 *
 * USAGE FOR FUTURE TABLES:
 * 1. Create a new file: `{entity-name}-populate-config.ts`
 * 2. Import PopulateMapping type from populate-builder
 * 3. Define mappings array with columnKey -> relationField mappings
 * 4. Import and use buildPopulateFromVisible in your fetch function
 *
 * EXAMPLES:
 *
 * Simple relation (one level):
 * {
 *   columnKey: "organization_type",  // Column accessorKey/id
 *   relationField: "organization_type",  // Relation field name in model
 * }
 *
 * Nested relation (multiple levels):
 * {
 *   columnKey: "subscriptions_channel",  // Column accessorKey/id
 *   relationField: "subscriptions",  // Top-level relation
 *   nestedPopulate: {  // Nested populate structure
 *     channel: true  // Populate channel within subscriptions
 *   }
 * }
 *
 * Deep nested relation (3+ levels):
 * {
 *   columnKey: "contacts_subscriptions_channel",
 *   relationField: "contacts",
 *   nestedPopulate: {
 *     subscriptions: {
 *       populate: {
 *         channel: true
 *       }
 *     }
 *   }
 * }
 */

import type { PopulateMapping } from "./populate-builder";

/**
 * Populate mappings for organizations
 * Each mapping defines which column requires which relation to be populated
 */
export const ORGANIZATIONS_POPULATE_MAPPINGS: PopulateMapping[] = [
	{
		columnKey: "organization_type",
		relationField: "organization_type",
		// organization_type is a simple relation, no nested populate needed
	},
	{
		columnKey: "frequency",
		relationField: "frequency",
	},
	{
		columnKey: "media_type",
		relationField: "media_type",
	},
	{
		columnKey: "tags",
		relationField: "tags",
	},
	{
		columnKey: "industry",
		relationField: "industry",
	},
	{
		columnKey: "contacts",
		relationField: "contacts",
	},
	{
		columnKey: "sources",
		relationField: "sources",
	},
	// Example for nested populate (uncomment and modify as needed):
	// {
	//   columnKey: "subscriptions_channel",  // Column that displays subscriptions.channel
	//   relationField: "subscriptions",  // Top-level relation field
	//   nestedPopulate: {  // Nested populate structure
	//     channel: true  // Populate channel within subscriptions
	//   }
	// },
];

