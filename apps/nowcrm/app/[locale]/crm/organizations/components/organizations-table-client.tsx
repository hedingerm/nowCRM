"use client";

import type { VisibilityState } from "@tanstack/react-table";
import type { Session } from "next-auth";
import * as React from "react";
import DataTable from "@/components/dataTable/data-table-old";
import { transformFilters } from "@/lib/actions/filters/filters-search";
import { fetchOrganizationsForVisibleColumns } from "@/lib/actions/organizations/fetch-organizations";
import {
	loadFiltersFromStorage,
	loadPaginationFromStorage,
	loadSearchFromStorage,
	savePaginationToStorage,
	saveSearchToStorage,
} from "@/lib/filters/filter-storage";
import AdvancedFilters from "./advancedFilters/advanced-filters";
import { getColumns } from "./columns/org-columns";
import createOrganizationDialog from "./create-dialog";
import MassActionsContacts from "./massActions/mass-actions";

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
	// Load filters from localStorage synchronously before any state initialization
	// Only check on client side (localStorage is not available during SSR)
	const initialLocalFilters = React.useMemo(() => {
		if (typeof window === "undefined") {
			return {};
		}
		try {
			const storedFilters = loadFiltersFromStorage("organizations", session);
			if (storedFilters) {
				// Transform UI filters to Strapi filters
				return transformFilters(storedFilters);
			}
		} catch {
			// Ignore localStorage errors
		}
		return {};
	}, [session]);

	// Load pagination from localStorage
	const initialPaginationFromStorage = React.useMemo(() => {
		if (typeof window === "undefined") {
			return null;
		}
		try {
			return loadPaginationFromStorage("organizations", session);
		} catch {
			return null;
		}
	}, [session]);

	// Load search from localStorage
	const initialSearchFromStorage = React.useMemo(() => {
		if (typeof window === "undefined") {
			return null;
		}
		try {
			return loadSearchFromStorage("organizations", session);
		} catch {
			return null;
		}
	}, [session]);

	// Check if we have localFilters - if so, we should refetch immediately and not show initialData
	const hasLocalFilters = React.useMemo(() => {
		return initialLocalFilters && Object.keys(initialLocalFilters).length > 0;
	}, [initialLocalFilters]);

	// Check if we have stored pagination that differs from initial
	const hasStoredPagination = React.useMemo(() => {
		return (
			initialPaginationFromStorage &&
			(initialPaginationFromStorage.page !== initialPagination.page ||
				initialPaginationFromStorage.pageSize !== initialPagination.pageSize)
		);
	}, [initialPaginationFromStorage, initialPagination]);

	// Check if we have stored search that differs from initial
	const hasStoredSearch = React.useMemo(() => {
		return (
			initialSearchFromStorage &&
			initialSearchFromStorage !== search &&
			initialSearchFromStorage.trim() !== ""
		);
	}, [initialSearchFromStorage, search]);

	const [data, setData] = React.useState(() => {
		// If we have localFilters, stored pagination, or stored search, start with empty data to prevent flash
		// The useEffect will immediately fetch with correct filters/pagination/search
		return hasLocalFilters || hasStoredPagination || hasStoredSearch
			? []
			: initialData;
	});

	// Initialize pagination from localStorage if available, otherwise use initialPagination
	// Merge stored page/pageSize with initial pagination to preserve pageCount and total
	const [pagination, setPagination] = React.useState(() => {
		if (initialPaginationFromStorage) {
			return {
				...initialPagination,
				page: initialPaginationFromStorage.page,
				pageSize: initialPaginationFromStorage.pageSize,
			};
		}
		return initialPagination;
	});

	const [isLoading, setIsLoading] = React.useState(
		hasLocalFilters || hasStoredPagination || hasStoredSearch,
	); // Show loading if we need to refetch
	const [currentSortBy] = React.useState(sortBy);
	const [currentSortOrder] = React.useState(sortOrder);
	// Use search from localStorage if available, otherwise use prop search
	const [currentSearch, setCurrentSearch] = React.useState(
		initialSearchFromStorage || search,
	);

	// Track which fields are available in current data
	const [availableFields, setAvailableFields] = React.useState<Set<string>>(
		() => {
			if (!hasLocalFilters && initialData.length > 0) {
				return new Set(Object.keys(initialData[0]));
			}
			return new Set();
		},
	);

	// Load filters from localStorage and transform them
	const [localFilters, setLocalFilters] =
		React.useState<any>(initialLocalFilters);

	// Get tag filter key for reading from localStorage
	const tagFilterKey = React.useMemo(() => {
		const userId =
			session?.user?.strapi_id || session?.user?.email || "anonymous";
		return `filters.tag.organizations.${userId}`;
	}, [session]);

	// Helper to get selected tag from localStorage
	const getSelectedTag = React.useCallback((): string | null => {
		if (typeof window === "undefined") {
			return null;
		}
		try {
			return localStorage.getItem(tagFilterKey);
		} catch {
			return null;
		}
	}, [tagFilterKey]);

	// Ref to prevent multiple simultaneous fetch calls
	const isFetchingRef = React.useRef(false);

	// Create user-specific localStorage key
	const LS_COLUMN_VISIBILITY_KEY = React.useMemo(() => {
		const userId =
			session?.user?.strapi_id || session?.user?.email || "anonymous";
		return `datatable.columnVisibility.organizations.${userId}`;
	}, [session?.user?.strapi_id, session?.user?.email]);

	// Get columns with session
	// Columns will be defined after fetchData to avoid circular dependency

	// Default visible columns (matching DEFAULT_VISIBLE_FIELDS from page.tsx)
	// Note: "id" and "documentId" are always included in the data, so we don't need explicit columns for them
	const DEFAULT_VISIBLE_COLUMN_IDS = React.useMemo(() => {
		return ["select", "actions", "name", "email", "address_line1", "tags"];
	}, []);

	// Ref to store refetch callback for columns (to avoid circular dependency)
	const refetchRef = React.useRef<(() => void) | null>(null);

	// Get columns with session (using ref to avoid circular dependency with fetchData)
	const columns = React.useMemo(
		() => getColumns(session, () => {
			if (refetchRef.current) {
				refetchRef.current();
			}
		}),
		[session],
	);

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
				localStorage.setItem(
					LS_COLUMN_VISIBILITY_KEY,
					JSON.stringify(defaultVisibility),
				);
			}
		} catch {
			// Ignore localStorage errors
		}
		return null; // useMemo must return a value
	}, [LS_COLUMN_VISIBILITY_KEY, DEFAULT_VISIBLE_COLUMN_IDS, columns]);

	// Get visible column IDs from localStorage (for DataTable component)
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
	}, [LS_COLUMN_VISIBILITY_KEY, DEFAULT_VISIBLE_COLUMN_IDS, columns]);

	// Get visible field names (accessorKeys) for API calls
	const getVisibleFieldNames = React.useCallback((): string[] => {
		try {
			const stored = localStorage.getItem(LS_COLUMN_VISIBILITY_KEY);
			if (stored) {
				const parsed = JSON.parse(stored) as VisibilityState;
				// Extract visible column accessorKeys (field names)
				const visibleFields = columns
					.filter((col) => {
						const colId = (col as any)?.id || (col as any)?.accessorKey;
						// If column visibility is explicitly set to false, hide it
						// If not set (undefined), show it (default visible)
						return (
							colId && parsed[colId] !== false && (col as any)?.accessorKey
						);
					})
					.map((col) => (col as any)?.accessorKey)
					.filter(Boolean);

				// If we have stored visibility, use it
				if (visibleFields.length > 0) {
					return visibleFields;
				}
			}
		} catch {
			// Fallback to default columns
		}
		// Return default visible fields (accessorKeys) if no localStorage or empty localStorage
		return columns
			.filter((col) => {
				const colId = (col as any)?.id || (col as any)?.accessorKey;
				return (
					colId &&
					DEFAULT_VISIBLE_COLUMN_IDS.includes(colId) &&
					(col as any)?.accessorKey
				);
			})
			.map((col) => (col as any)?.accessorKey)
			.filter(Boolean);
	}, [LS_COLUMN_VISIBILITY_KEY, DEFAULT_VISIBLE_COLUMN_IDS, columns]);

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
				// Get visible column IDs for populate mapping (don't include in deps to avoid loops)
				const visibleIds = getVisibleColumnIds();
				// Get visible field names (accessorKeys) for fields array
				const visibleFields = getVisibleFieldNames();
				// Merge filters: params.filters takes highest precedence, then localFilters, then serverFilters
				let mergedFilters =
					params.filters !== undefined
						? params.filters // If filters are explicitly passed, use them directly
						: {
								...(serverFilters ?? {}),
								...(localFilters ?? {}),
							};

				// Add tag filter if selected (read from localStorage)
				const selectedTag = getSelectedTag();
				if (selectedTag) {
					// Tags use documentId for filtering (TagFilterHeader stores documentId)
					const tagFilter = { tags: { documentId: { $eq: selectedTag } } };
					if (Object.keys(mergedFilters).length > 0) {
						// Flatten $and structures instead of nesting
						const filterArray = mergedFilters.$and
							? mergedFilters.$and
							: [mergedFilters];
						mergedFilters = { $and: [...filterArray, tagFilter] };
					} else {
						mergedFilters = tagFilter;
					}
				}

				const pageToUse = params.page ?? pagination.page;
				const pageSizeToUse = params.pageSize ?? pagination.pageSize;

				// Normalize search: use param if provided, otherwise use currentSearch, treat empty/null as no search
				const searchToUse =
					params.search !== undefined
						? params.search?.trim() || ""
						: currentSearch?.trim() || "";

				const res = await fetchOrganizationsForVisibleColumns({
					visibleIds, // For populate mapping
					visibleFields, // For fields array
					page: pageToUse,
					pageSize: pageSizeToUse,
					sortBy: params.sortBy ?? currentSortBy,
					sortOrder: params.sortOrder ?? currentSortOrder,
					filters: mergedFilters,
					search: searchToUse,
				});
				console.log(res);
				if (res?.success && res.data) {
					setData(res.data);
					if (res.meta?.pagination) {
						const newPagination = res.meta.pagination;
						setPagination(newPagination);
						// Save pagination to localStorage
						savePaginationToStorage(
							"organizations",
							{ page: newPagination.page, pageSize: newPagination.pageSize },
							session,
						);
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
			getSelectedTag,
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
		// Update refetchRef for columns to use
		refetchRef.current = () => fetchData({ page: 1 });
	}, [fetchData]);

	// On mount, check if we need to refetch with merged filters or different columns
	React.useEffect(() => {
		const visibleFields = getVisibleFieldNames();
		const initialFields = new Set(Object.keys(initialData[0] || {}));

		// Check if any visible field is missing from initial data
		const missingFields = visibleFields.filter(
			(field) => !initialFields.has(field as string),
		);

		// If we have localFilters OR missing fields OR tag filter OR stored pagination OR stored search, refetch with correct fields/filters/pagination/search
		// This ensures we always fetch with merged filters if localFilters or tag filter exist, or if pagination/search differs
		const hasTagFilter = getSelectedTag() !== null;
		if (
			(hasLocalFilters ||
				missingFields.length > 0 ||
				hasTagFilter ||
				hasStoredPagination ||
				hasStoredSearch) &&
			!isFetchingRef.current
		) {
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
				localStorage.setItem(
					LS_COLUMN_VISIBILITY_KEY,
					JSON.stringify(defaultVisibility),
				);
			}
		} catch {
			// Ignore localStorage errors
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Only run on mount

	// Listen for tag filter changes
	React.useEffect(() => {
		const handleTagFilterChange = () => {
			// Small delay to ensure localStorage is updated
			setTimeout(() => {
				fetchData({ page: 1 });
			}, 0);
		};
		window.addEventListener("tagFilterChanged", handleTagFilterChange);
		return () => {
			window.removeEventListener("tagFilterChanged", handleTagFilterChange);
		};
	}, [fetchData]);

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
			advancedFilters={React.useMemo(() => {
				const handleFilterSubmit = (filters: any, search?: string) => {
					// Update filters state immediately
					setLocalFilters(filters || {});
					// Update search term if provided
					if (search !== undefined) {
						const normalizedSearch = search?.trim() || "";
						saveSearchToStorage("organizations", normalizedSearch, session);
						setCurrentSearch(normalizedSearch);
					}
					// Refetch with new filters and search
					// Pass both explicitly to ensure they're used
					fetchData({ page: 1, filters: filters || {}, search: search });
				};

				return function OrganizationsAdvancedFilters() {
					return (
						<AdvancedFilters
							session={session}
							onSubmitComplete={handleFilterSubmit}
							onSearchChange={(search, filters) => {
								// Update search term when applying search history
								const normalizedSearch = search?.trim() || "";
								saveSearchToStorage("organizations", normalizedSearch, session);
								setCurrentSearch(normalizedSearch);
								// If filters are provided, update localFilters state
								if (filters !== undefined) {
									setLocalFilters(filters || {});
								}
								// Fetch data with new search and filters
								// Use provided filters if available, otherwise use current localFilters
								const filtersToUse =
									filters !== undefined ? filters : localFilters;
								fetchData({
									page: 1,
									search: normalizedSearch,
									filters: filtersToUse,
								});
							}}
							entityType="organizations"
							currentSearch={currentSearch}
						/>
					);
				};
			}, [session, fetchData])}
			session={session}
			showStatusModal
			sorting={{ sortBy: currentSortBy, sortOrder: currentSortOrder }}
			onVisibleColumnsChange={(ids) => handleVisibleColumnsChange.current(ids)}
			onPaginationChange={(page, pageSize) => {
				// Save pagination to localStorage immediately
				savePaginationToStorage("organizations", { page, pageSize }, session);
				// Update local state
				setPagination((prev) => ({ ...prev, page, pageSize }));
				// Fetch data with new pagination
				fetchData({ page, pageSize });
			}}
			onSearchChange={(searchTerm, filters) => {
				// Trim and normalize search term
				const normalizedSearch = searchTerm?.trim() || "";
				// Save search to localStorage immediately (empty string clears it)
				saveSearchToStorage("organizations", normalizedSearch, session);
				// Update local state
				setCurrentSearch(normalizedSearch);
				// If filters are provided, update localFilters state
				if (filters !== undefined) {
					setLocalFilters(filters || {});
				}
				// Fetch data with new search and filters
				// Use provided filters if available, otherwise use current localFilters
				const filtersToUse = filters !== undefined ? filters : localFilters;
				fetchData({ page: 1, search: normalizedSearch, filters: filtersToUse });
			}}
			initialSearch={currentSearch}
			isLoading={isLoading}
			availableFields={availableFields}
		/>
	);
}
