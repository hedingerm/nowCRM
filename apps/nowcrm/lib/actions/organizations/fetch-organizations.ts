"use server";

import { organizationsService } from "@nowcrm/services/server";
import { auth } from "@/auth";
import { ORGANIZATIONS_POPULATE_MAPPINGS } from "@/lib/populate/organizations-populate-config";
import { buildPopulateFromVisible } from "@/lib/populate/populate-builder";
import { getSearchFields } from "@/lib/search/search-fields-config";

const IGNORE = new Set(["select", "actions", "delete"]);

// Relation names in Organization model
const RELATIONS = new Set([
	"organization_type",
	"tags",
	"contacts",
	"frequency",
	"media_type",
	"industry",
	"sources",
]);

function fieldsFromVisible(
	visibleIds: string[],
	alwaysInclude: string[] = ["id", "documentId"],
): string[] {
	const s = new Set<string>(alwaysInclude.filter(Boolean));

	for (const raw of visibleIds) {
		const id = (raw || "").trim();
		if (!id || IGNORE.has(id)) continue;
		// ignore dotted paths -> handled by populate
		if (id.includes(".")) continue;
		// ignore relations in fields
		if (RELATIONS.has(id)) continue;
		s.add(id);
	}
	return Array.from(s);
}

export async function fetchOrganizationsForVisibleColumns(input: {
	visibleIds: string[]; // Column IDs for populate mapping
	visibleFields?: string[]; // Field names (accessorKeys) for fields array
	page: number;
	pageSize: number;
	sortBy: string;
	sortOrder: "asc" | "desc";
	filters?: any;
	search?: string;
}) {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	const {
		visibleIds,
		visibleFields,
		page,
		pageSize,
		sortBy,
		sortOrder,
		filters,
		search,
	} = input;

	// Use visibleFields if provided (accessorKeys), otherwise fall back to visibleIds
	const fields = visibleFields
		? fieldsFromVisible(visibleFields, [sortBy, "id", "documentId"])
		: fieldsFromVisible(visibleIds, [sortBy, "id", "documentId"]);

	// Build search filters using configured search fields
	const searchFields = getSearchFields("organizations");
	const searchFilters = search?.trim()
		? {
				$or: searchFields.map((field) => ({
					[field]: { $containsi: search.trim() },
				})),
			}
		: null;

	// Properly combine filters and search filters, flattening $and structures
	let combinedFilters: any = {};
	const hasFilters = filters && Object.keys(filters).length > 0;
	const hasSearch = searchFilters && Object.keys(searchFilters).length > 0;

	if (hasFilters && hasSearch) {
		// Both filters and search exist - flatten $and structures
		// searchFilters always has $or structure, so we don't need to check for $and
		const filterArray = filters.$and ? filters.$and : [filters];
		combinedFilters = {
			$and: [...filterArray, searchFilters],
		};
	} else if (hasFilters) {
		// Only filters exist
		combinedFilters = filters;
	} else if (hasSearch) {
		// Only search exists
		combinedFilters = searchFilters;
	}

	// Build populate structure based on visible columns
	const populate = buildPopulateFromVisible(
		visibleIds,
		ORGANIZATIONS_POPULATE_MAPPINGS,
	);

	return await organizationsService.find(session?.jwt, {
		fields: fields as any,
		populate: populate === "*" ? "*" : (populate as any),
		sort: [`${sortBy}:${sortOrder}`] as any,
		pagination: { page, pageSize },
		filters:
			Object.keys(combinedFilters).length > 0 ? combinedFilters : undefined,
	});
}
