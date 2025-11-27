/**
 * Build populate structure for Strapi queries based on visible columns
 * Supports nested populates (e.g., "subscriptions.channel")
 */

export type PopulateConfig = Record<
	string,
	boolean | { populate: PopulateConfig }
>;

export type PopulateMapping = {
	/**
	 * Column accessorKey or id that requires this relation to be populated
	 */
	columnKey: string;
	/**
	 * Relation field name in the model
	 */
	relationField: string;
	/**
	 * Nested populate structure (for deep relations)
	 * Example: { channel: true } for "subscriptions.channel"
	 */
	nestedPopulate?: PopulateConfig;
};

/**
 * Build populate structure from visible columns and populate mappings
 * @param visibleColumnIds - Array of visible column IDs/accessorKeys
 * @param populateMappings - Array of mappings from column keys to relation fields
 * @returns PopulateConfig object ready for Strapi populate parameter
 */
export function buildPopulateFromVisible(
	visibleColumnIds: string[],
	populateMappings: PopulateMapping[],
): PopulateConfig | "*" {
	// If no mappings, return empty object (no populates needed)
	if (populateMappings.length === 0) {
		return {};
	}

	// Create a set of visible column keys for quick lookup
	const visibleSet = new Set(visibleColumnIds);

	// Build populate structure
	const populate: PopulateConfig = {};

	for (const mapping of populateMappings) {
		// Check if this column is visible
		if (visibleSet.has(mapping.columnKey)) {
			// If there's nested populate, use it; otherwise just populate the relation
			if (mapping.nestedPopulate) {
				populate[mapping.relationField] = {
					populate: mapping.nestedPopulate,
				};
			} else {
				populate[mapping.relationField] = true;
			}
		}
	}

	// If no populates needed, return empty object
	if (Object.keys(populate).length === 0) {
		return {};
	}

	return populate;
}

/**
 * Build nested populate structure from dot-notation paths
 * Example: "subscriptions.channel" -> { subscriptions: { populate: { channel: true } } }
 * @param path - Dot-notation path (e.g., "subscriptions.channel")
 * @returns PopulateConfig object
 */
export function buildNestedPopulateFromPath(path: string): PopulateConfig {
	const parts = path.split(".");
	if (parts.length === 0) {
		return {};
	}

	// Build nested structure from right to left
	let result: PopulateConfig = { [parts[parts.length - 1]]: true };

	for (let i = parts.length - 2; i >= 0; i--) {
		result = { [parts[i]]: { populate: result } };
	}

	return result;
}

/**
 * Merge multiple populate configs into one
 * Useful when combining different populate sources
 */
export function mergePopulateConfigs(
	...configs: (PopulateConfig | "*" | undefined)[]
): PopulateConfig | "*" {
	// If any config is "*", return "*"
	if (configs.some((c) => c === "*")) {
		return "*";
	}

	const merged: PopulateConfig = {};

	for (const config of configs) {
		if (!config || typeof config !== "object") continue;

		for (const [key, value] of Object.entries(config)) {
			if (value === true) {
				// Simple populate - just set to true
				merged[key] = true;
			} else if (value && typeof value === "object" && "populate" in value) {
				// Nested populate - merge nested structures
				const existing = merged[key];
				if (existing === true) {
					// If already true, keep it (true is more permissive)
					continue;
				} else if (
					existing &&
					typeof existing === "object" &&
					"populate" in existing
				) {
					// Merge nested populates
					merged[key] = {
						populate: mergePopulateConfigs(
							existing.populate as PopulateConfig,
							value.populate as PopulateConfig,
						) as PopulateConfig,
					};
				} else {
					// New nested populate
					merged[key] = value;
				}
			}
		}
	}

	return merged;
}

