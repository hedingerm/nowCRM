"use server";

import { organizationsService } from "@nowcrm/services/server";
import { auth } from "@/auth";

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
	visibleIds: string[];
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
		page,
		pageSize,
		sortBy,
		sortOrder,
		filters,
		search,
	} = input;

	const fields = fieldsFromVisible(visibleIds, [
		sortBy,
		"id",
		"documentId",
	]);

	const searchFilters = search
		? {
				$or: [
					{ name: { $containsi: search } },
					{ email: { $containsi: search } },
				],
			}
		: {};

	const combinedFilters = filters
		? { ...filters, ...searchFilters }
		: searchFilters;

	return await organizationsService.find(session?.jwt, {
		fields: fields as any,
		populate: "*",
		sort: [`${sortBy}:${sortOrder}`] as any,
		pagination: { page, pageSize },
		filters: Object.keys(combinedFilters).length > 0 ? combinedFilters : undefined,
	});
}

