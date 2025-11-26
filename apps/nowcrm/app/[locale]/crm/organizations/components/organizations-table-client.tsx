"use client";

import type { Session } from "next-auth";
import type { VisibilityState } from "@tanstack/react-table";
import * as React from "react";
import { fetchOrganizationsForVisibleColumns } from "@/lib/actions/organizations/fetch-organizations";
import DataTable from "@/components/dataTable/data-table-old";
import { columns } from "./columns/org-columns";
import AdvancedFilters from "./advancedFilters/advanced-filters";
import createOrganizationDialog from "./create-dialog";
import MassActionsContacts from "./massActions/mass-actions";
import { loadFiltersFromStorage } from "@/lib/filters/filter-storage";
import { transformFilters } from "@/lib/actions/filters/filters-search";

type Props = {
	initialData: any[];
	initialPagination: {
		page: number;
		pageSize: number;
		pageCount: number;
		total: number;
	};
	sortBy: string;
	sortOrder: "asc" | "desc";
	session?: Session;
	serverFilters?: any;
	search?: string;
};

export default function OrganizationsTableClient({
	initialData,
	initialPagination,
	sortBy,
	sortOrder,
	session,
	serverFilters,
	search = "",
}: Props) {
	const [data, setData] = React.useState(initialData);
	const [pagination, setPagination] = React.useState(initialPagination);
	const [isLoading, setIsLoading] = React.useState(false);
	const [currentSortBy] = React.useState(sortBy);
	const [currentSortOrder] = React.useState(sortOrder);
	const [currentSearch] = React.useState(search);
	
	// Track which fields are available in current data
	const [availableFields, setAvailableFields] = React.useState<Set<string>>(() => {
		if (initialData.length > 0) {
			return new Set(Object.keys(initialData[0]));
		}
		return new Set();
	});

	// Load filters from localStorage and transform them
	const [localFilters, setLocalFilters] = React.useState<any>(() => {
		const storedFilters = loadFiltersFromStorage("organizations", session);
		if (storedFilters) {
			// Transform UI filters to Strapi filters
			return transformFilters(storedFilters);
		}
		return {};
	});

	// Ref to prevent multiple simultaneous fetch calls
	const isFetchingRef = React.useRef(false);

	// Create user-specific localStorage key
	const LS_COLUMN_VISIBILITY_KEY = React.useMemo(
		() => {
			const userId = session?.user?.strapi_id || session?.user?.email || "anonymous";
			return `datatable.columnVisibility.organizations.${userId}`;
		},
		[session?.user?.strapi_id, session?.user?.email],
	);

	// Default visible columns (matching DEFAULT_VISIBLE_FIELDS from page.tsx)
	// Note: "id" and "documentId" are always included in the data, so we don't need explicit columns for them
	const DEFAULT_VISIBLE_COLUMN_IDS = React.useMemo(() => {
		return ["select", "actions", "name", "email", "address_line1"];
	}, []);

	// Initialize default column visibility in localStorage if empty (synchronously, before DataTable reads it)
	React.useMemo(() => {
		try {
			const stored = localStorage.getItem(LS_COLUMN_VISIBILITY_KEY);
			if (!stored) {
				// Set default visibility: hide all columns except default ones
				const defaultVisibility: VisibilityState = {};
				columns.forEach((col) => {
					const colId = (col as any)?.id || (col as any)?.accessorKey;
					if (colId && !DEFAULT_VISIBLE_COLUMN_IDS.includes(colId)) {
						defaultVisibility[colId] = false;
					}
				});
				localStorage.setItem(LS_COLUMN_VISIBILITY_KEY, JSON.stringify(defaultVisibility));
			}
		} catch {
			// Ignore localStorage errors
		}
		return null; // useMemo must return a value
	}, [LS_COLUMN_VISIBILITY_KEY]);

	// Get visible column IDs from localStorage
	const getVisibleColumnIds = React.useCallback((): string[] => {
		try {
			const stored = localStorage.getItem(LS_COLUMN_VISIBILITY_KEY);
			if (stored) {
				const parsed = JSON.parse(stored) as VisibilityState;
				// Extract visible column IDs
				const visibleIds = columns
					.filter((col) => {
						const colId = (col as any)?.id || (col as any)?.accessorKey;
						// If column visibility is explicitly set to false, hide it
						// If not set (undefined), show it (default visible)
						return colId && parsed[colId] !== false;
					})
					.map((col) => (col as any)?.id || (col as any)?.accessorKey)
					.filter(Boolean);
				
				// If we have stored visibility, use it
				if (visibleIds.length > 0) {
					return visibleIds;
				}
			}
		} catch {
			// Fallback to default columns
		}
		// Return default visible columns if no localStorage or empty localStorage
		return DEFAULT_VISIBLE_COLUMN_IDS;
	}, [LS_COLUMN_VISIBILITY_KEY, DEFAULT_VISIBLE_COLUMN_IDS]);

	const fetchData = React.useCallback(
		async (params: {
			page?: number;
			pageSize?: number;
			sortBy?: string;
			sortOrder?: "asc" | "desc";
			filters?: any;
			search?: string;
		}) => {
			// Prevent multiple simultaneous calls
			if (isFetchingRef.current) {
				return;
			}
			isFetchingRef.current = true;
			setIsLoading(true);

			try {
				// Get visible column IDs fresh each time (don't include in deps to avoid loops)
				const visibleIds = getVisibleColumnIds();
				// Merge filters: params.filters takes highest precedence, then localFilters, then serverFilters
				const mergedFilters = params.filters !== undefined
					? params.filters // If filters are explicitly passed, use them directly
					: {
							...(serverFilters ?? {}),
							...(localFilters ?? {}),
						};

				const res = await fetchOrganizationsForVisibleColumns({
					visibleIds,
					page: params.page ?? pagination.page,
					pageSize: params.pageSize ?? pagination.pageSize,
					sortBy: params.sortBy ?? currentSortBy,
					sortOrder: params.sortOrder ?? currentSortOrder,
					filters: mergedFilters,
					search: params.search ?? currentSearch,
				});
				if (res?.success && res.data) {
					setData(res.data);
					if (res.meta?.pagination) {
						setPagination(res.meta.pagination);
					}
					// Update available fields
					if (res.data.length > 0) {
						setAvailableFields(new Set(Object.keys(res.data[0])));
					}
				}
			} finally {
				setIsLoading(false);
				isFetchingRef.current = false;
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			pagination.page,
			pagination.pageSize,
			currentSortBy,
			currentSortOrder,
			currentSearch,
			serverFilters,
			localFilters,
			// Don't include getVisibleColumnIds - we call it fresh each time
		],
	);

	const handleVisibleColumnsChange = React.useRef((_ids: string[]) => {
		// Refetch data when column visibility changes
		fetchData({
			page: 1, // Reset to first page
		});
	});

	// Update the ref when fetchData changes
	React.useEffect(() => {
		handleVisibleColumnsChange.current = (_ids: string[]) => {
			fetchData({
				page: 1,
			});
		};
	}, [fetchData]);

	// On mount, check if localStorage has different visible columns than initial data
	// Also load filters from localStorage
	React.useEffect(() => {
		// Load filters from localStorage and transform them
		const storedFilters = loadFiltersFromStorage("organizations", session);
		if (storedFilters) {
			// Transform UI filters to Strapi filters
			const strapiFilters = transformFilters(storedFilters);
			setLocalFilters(strapiFilters);
		}

		const visibleIds = getVisibleColumnIds();
		const initialFields = new Set(Object.keys(initialData[0] || {}));
		
		// Check if we need to fetch different fields
		// Get accessorKeys from visible columns
		const visibleAccessorKeys = columns
			.filter((col) => {
				const colId = (col as any)?.id || (col as any)?.accessorKey;
				return colId && visibleIds.includes(colId) && (col as any)?.accessorKey;
			})
			.map((col) => (col as any)?.accessorKey)
			.filter(Boolean);

		// Check if any visible field is missing from initial data
		const missingFields = visibleAccessorKeys.filter(
			(field) => !initialFields.has(field as string)
		);

		// If there are missing fields or stored filters, refetch with correct fields/filters
		if ((missingFields.length > 0 || storedFilters) && !isFetchingRef.current) {
			fetchData({});
		}
		
		// Initialize column visibility if localStorage is empty
		try {
			const storedVisibility = localStorage.getItem(LS_COLUMN_VISIBILITY_KEY);
			if (!storedVisibility) {
				// Set default visibility: hide all columns except default ones
				const defaultVisibility: VisibilityState = {};
				columns.forEach((col) => {
					const colId = (col as any)?.id || (col as any)?.accessorKey;
					if (colId && !DEFAULT_VISIBLE_COLUMN_IDS.includes(colId)) {
						defaultVisibility[colId] = false;
					}
				});
				localStorage.setItem(LS_COLUMN_VISIBILITY_KEY, JSON.stringify(defaultVisibility));
			}
		} catch {
			// Ignore localStorage errors
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Only run on mount

	return (
		<DataTable
			data={data}
			columns={columns}
			table_name="organizations"
			table_title="Organizations"
			mass_actions={MassActionsContacts}
			pagination={pagination}
			createDialog={createOrganizationDialog}
			createDialogProps={{
				onSuccess: () => {
					// Refetch data after creating organization
					fetchData({ page: 1 });
				},
			}}
			advancedFilters={React.useMemo(
				() => {
					const handleFilterSubmit = (filters: any) => {
						// Update filters state immediately
						setLocalFilters(filters || {});
						// Refetch with new filters directly (filters param takes precedence)
						// Use a small delay to ensure state update is processed
						setTimeout(() => {
							fetchData({ page: 1, filters: filters || {} });
						}, 0);
					};
					
					return function OrganizationsAdvancedFilters() {
						return (
							<AdvancedFilters
								session={session}
								onSubmitComplete={handleFilterSubmit}
							/>
						);
					};
				},
				[session, fetchData],
			)}
			session={session}
			showStatusModal
			sorting={{ sortBy: currentSortBy, sortOrder: currentSortOrder }}
			onVisibleColumnsChange={(ids) => handleVisibleColumnsChange.current(ids)}
			isLoading={isLoading}
			availableFields={availableFields}
		/>
	);
}

