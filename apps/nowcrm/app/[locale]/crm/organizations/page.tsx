import { organizationsService } from "@nowcrm/services/server";
import type { Metadata } from "next";
import type { Session } from "next-auth";
import { auth } from "@/auth";
import ErrorMessage from "@/components/error-message";
import {
	parseQueryToFilterValues,
	transformFilters,
} from "@/lib/actions/filters/filters-search";
import { buildPopulateFromVisible } from "@/lib/populate/populate-builder";
import { ORGANIZATIONS_POPULATE_MAPPINGS } from "@/lib/populate/organizations-populate-config";
import OrganizationsTableClient from "./components/organizations-table-client";

export const metadata: Metadata = {
	title: "Organizations",
};

// Default visible fields - columns that are shown by default (used for initial fetch)
const DEFAULT_VISIBLE_FIELDS = [
	"documentId",
	"id",
	"name",
	"email",
	"address_line1",
] as const;

export default async function Page(props: { searchParams: Promise<any> }) {
	const searchParams = await props.searchParams;
	const {
		page = 1,
		pageSize = 10,
		search = "",
		sortBy = "id",
		sortOrder = "desc",
		...urlFilters
	} = searchParams;

	const flatFilters = parseQueryToFilterValues<Record<string, any>>(
		new URLSearchParams(urlFilters),
	);
	const transformedFilters = transformFilters(flatFilters);

	const session = await auth();
	
	// Build populate structure based on default visible fields
	// Note: DEFAULT_VISIBLE_FIELDS includes "tags" which needs to be populated
	const defaultVisibleIds = [...DEFAULT_VISIBLE_FIELDS, "tags"] as string[];
	const populate = buildPopulateFromVisible(
		defaultVisibleIds,
		ORGANIZATIONS_POPULATE_MAPPINGS,
	);
	
	const response = await organizationsService.find(session?.jwt, {
		fields: DEFAULT_VISIBLE_FIELDS as any,
		populate: populate === "*" ? "*" : (populate as any),
		sort: [`${sortBy}:${sortOrder}` as any],
		pagination: {
			page,
			pageSize,
		},
		filters: {
			...transformedFilters,
			$or: [
				{ name: { $containsi: search } },
				{ email: { $containsi: search } },
			],
		},
	});
	if (!response.success || !response.data || !response.meta) {
		return <ErrorMessage response={response} />;
	}
	const { meta } = response;

	return (
		<div className="container">
			<OrganizationsTableClient
				initialData={response.data}
				initialPagination={meta.pagination}
				sortBy={sortBy}
				sortOrder={sortOrder}
				session={session as Session}
				serverFilters={transformedFilters}
				search={search}
			/>
		</div>
	);
}
