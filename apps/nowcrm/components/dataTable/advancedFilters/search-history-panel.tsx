"use client";

import type {
	DocumentId,
	SearchHistoryTemplate,
	SearchHistoryType,
} from "@nowcrm/services";
import {
	Edit3,
	History,
	Loader2,
	Star,
	StarOff,
	Trash2,
	X,
} from "lucide-react";
import * as React from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { deleteSearch } from "@/lib/actions/search_history/delete-search";
import { getSearchHistory } from "@/lib/actions/search_history/get-search-history";
import { makeFavorite } from "@/lib/actions/search_history/make-favorite-search";
import { updateSearchHistoryTemplate } from "@/lib/actions/search_history/update-search-history-template";

interface SearchHistoryPanelProps {
	entityType: SearchHistoryType;
	currentFilters?: any;
	currentSearch?: string;
	onApplySearch: (filters: any, search?: string) => void;
	onLoadFilters?: (filterValues: any) => void;
}

const PAGE_SIZE = 10;

export function SearchHistoryPanel({
	entityType,
	currentFilters,
	currentSearch,
	onApplySearch,
	onLoadFilters,
}: SearchHistoryPanelProps) {
	const [saved, setSaved] = React.useState<SearchHistoryTemplate[]>([]);
	const [loadingSaved, setLoadingSaved] = React.useState(false);
	const [loadingMore, setLoadingMore] = React.useState(false);
	const [hasMore, setHasMore] = React.useState(true);
	const [currentPage, setCurrentPage] = React.useState(1);
	const [searchQuery, setSearchQuery] = React.useState("");
	const [favoriteLoading, setFavoriteLoading] = React.useState<Set<string>>(
		new Set(),
	);
	const [editingSearchId, setEditingSearchId] = React.useState<string | null>(
		null,
	);
	const [editingName, setEditingName] = React.useState("");
	const [renameLoading, setRenameLoading] = React.useState<Set<string>>(
		new Set(),
	);
	const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
	const [searchToDelete, setSearchToDelete] = React.useState<DocumentId | null>(
		null,
	);
	const [deleting, setDeleting] = React.useState(false);

	const filteredSaved = React.useMemo(() => {
		if (!searchQuery.trim()) return saved;
		const query = searchQuery.toLowerCase();
		return saved.filter((search) => search.name.toLowerCase().includes(query));
	}, [saved, searchQuery]);

	const favoriteSaved = React.useMemo(
		() => filteredSaved.filter((search) => search.favorite === true),
		[filteredSaved],
	);

	// Load saved searches when component mounts
	React.useEffect(() => {
		let mounted = true;
		(async () => {
			setLoadingSaved(true);
			const res = await getSearchHistory(entityType, 1, PAGE_SIZE);
			if (mounted && res?.success && Array.isArray(res.data)) {
				setSaved(res.data);
				setHasMore(res.data.length === PAGE_SIZE);
				setCurrentPage(1);
			}
			setLoadingSaved(false);
		})();
		return () => {
			mounted = false;
		};
	}, [entityType]);

	async function loadMore() {
		if (loadingMore || !hasMore) return;

		setLoadingMore(true);
		try {
			const nextPage = currentPage + 1;
			const res = await getSearchHistory(entityType, nextPage, PAGE_SIZE);
			if (res?.success && res.data) {
				const newData = res.data;
				setSaved((prev) => [...prev, ...newData]);
				setHasMore(newData.length === PAGE_SIZE);
				setCurrentPage(nextPage);
			} else {
				setHasMore(false);
			}
		} catch (error) {
			console.error("Error loading more searches:", error);
		} finally {
			setLoadingMore(false);
		}
	}

	async function toggleFavorite(searchId: DocumentId) {
		const searchIdNum = searchId;
		const currentSearch = saved.find((s) => s.documentId === searchIdNum);
		if (!currentSearch) return;

		setFavoriteLoading((prev) => new Set(prev).add(searchId));

		try {
			const newFavoriteStatus = !currentSearch.favorite;
			const res = await makeFavorite(searchIdNum, newFavoriteStatus);
			if (res?.success) {
				setSaved((prevSaved) =>
					prevSaved.map((search) =>
						search.documentId === searchIdNum
							? { ...search, favorite: newFavoriteStatus }
							: search,
					),
				);
			}
		} catch (error) {
			console.error("Error toggling favorite:", error);
		} finally {
			setFavoriteLoading((prev) => {
				const newSet = new Set(prev);
				newSet.delete(searchId);
				return newSet;
			});
		}
	}

	function getFilterDescription(search: SearchHistoryTemplate): string {
		let stored: any = {};
		try {
			if (typeof search.filters === "string") {
				stored = JSON.parse(search.filters);
			} else if (
				typeof search.filters === "object" &&
				search.filters !== null
			) {
				stored = search.filters;
			}
		} catch (_error) {
			return "No filters";
		}

		const uiFilters = stored?.ui;
		if (!uiFilters || !Array.isArray(uiFilters.groups)) {
			return "No filters";
		}

		const filterDescriptions: string[] = [];

		uiFilters.groups.forEach((group: any, groupIndex: number) => {
			const groupFilters: string[] = [];

			Object.keys(group.filters || {}).forEach((key) => {
				if (key.endsWith("_operator")) return;

				const fieldName = key;
				const operator = group.filters[`${key}_operator`] || "$eq";
				const value = group.filters[key];

				if (value === undefined || value === null || value === "") return;

				const operatorText: Record<string, string> = {
					$eq: "=",
					$eqi: "=",
					$ne: "≠",
					$lt: "<",
					$lte: "≤",
					$gt: ">",
					$gte: "≥",
					$contains: "contains",
					$containsi: "contains",
					$notContainsi: "does not contain",
					$startsWithi: "starts with",
					$endsWithi: "ends with",
					$null: "is empty",
					$notNull: "is not empty",
					$in: "in",
					$notIn: "not in",
				};

				const opText = operatorText[operator] || operator;
				groupFilters.push(`${fieldName} ${opText} ${value}`);
			});

			if (groupFilters.length > 0) {
				const groupLogic = group.logic || "AND";
				filterDescriptions.push(
					`Group ${groupIndex + 1} (${groupLogic}): ${groupFilters.join(", ")}`,
				);
			}
		});

		if (filterDescriptions.length === 0) {
			return "No filters";
		}

		const groupLogic = uiFilters.groupLogic || "AND";
		return filterDescriptions.join(` ${groupLogic} `);
	}

	function applySavedSearch(search: SearchHistoryTemplate) {
		let stored: any = {};
		try {
			// Handle both string and object formats
			if (typeof search.filters === "string") {
				stored = JSON.parse(search.filters);
			} else if (
				typeof search.filters === "object" &&
				search.filters !== null
			) {
				stored = search.filters;
			}
		} catch (error) {
			console.error("Error parsing filters:", error);
			return;
		}

		const uiFilters = stored?.ui;
		const strapiFilters = stored?.strapiFilters || {};

		// Parse query - it can be stored as JSON string or plain string
		let query = "";
		try {
			if (typeof search.query === "string") {
				// Try parsing as JSON first
				const parsed = JSON.parse(search.query);
				query = typeof parsed === "string" ? parsed : "";
			} else if (search.query) {
				query = String(search.query);
			}
		} catch {
			// If parsing fails, use as plain string
			query = typeof search.query === "string" ? search.query : "";
		}

		// First, load the UI form values into the form if callback is provided
		if (onLoadFilters && uiFilters) {
			onLoadFilters(uiFilters);
			// Use a longer delay to ensure form is fully loaded and state is updated
			setTimeout(() => {
				onApplySearch(strapiFilters, query);
			}, 200);
		} else {
			// If no form loading callback, apply filters immediately
			onApplySearch(strapiFilters, query);
		}
	}

	async function handleRename(searchId: string, newName: string) {
		if (
			!newName.trim() ||
			newName === saved.find((s) => s.documentId === searchId)?.name
		) {
			setEditingSearchId(null);
			setEditingName("");
			return;
		}

		setRenameLoading((prev) => new Set(prev).add(searchId));

		try {
			const res = await updateSearchHistoryTemplate(searchId, {
				name: newName.trim(),
			});

			if (res?.success) {
				setSaved((prevSaved) =>
					prevSaved.map((search) =>
						search.documentId === searchId
							? { ...search, name: newName.trim() }
							: search,
					),
				);
			} else {
				console.error("Failed to rename search:", res?.errorMessage);
			}
		} catch (error) {
			console.error("Error renaming search:", error);
		} finally {
			setRenameLoading((prev) => {
				const newSet = new Set(prev);
				newSet.delete(searchId);
				return newSet;
			});
			setEditingSearchId(null);
			setEditingName("");
		}
	}

	function openDeleteDialog(searchId: DocumentId) {
		setSearchToDelete(searchId);
		setDeleteDialogOpen(true);
	}

	async function handleDelete() {
		if (!searchToDelete) return;

		setDeleting(true);
		try {
			const res = await deleteSearch(searchToDelete);
			if (res?.success) {
				setSaved((prevSaved) =>
					prevSaved.filter((s) => s.documentId !== searchToDelete),
				);
				setDeleteDialogOpen(false);
				setSearchToDelete(null);
			} else {
				console.error("Failed to delete search");
			}
		} catch (error) {
			console.error("Error deleting search:", error);
		} finally {
			setDeleting(false);
		}
	}

	const SavedSearchItem = ({ search }: { search: SearchHistoryTemplate }) => {
		const isFavorite = search.favorite === true;
		const isEditing = editingSearchId === search.documentId;
		const isFavoriteLoading = favoriteLoading.has(search.documentId);
		const isRenameLoading = renameLoading.has(search.documentId);
		const hasName = search.name && search.name.trim() !== "";

		return (
			<div className="flex items-center gap-2 rounded-md border p-2 transition-colors hover:bg-muted/50">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="h-6 w-6 shrink-0 p-0"
								onClick={() => toggleFavorite(search.documentId)}
								disabled={isFavoriteLoading}
							>
								{isFavoriteLoading ? (
									<Loader2 className="h-3 w-3 animate-spin" />
								) : isFavorite ? (
									<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
								) : (
									<StarOff className="h-3 w-3" />
								)}
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							{isFavoriteLoading
								? "Updating..."
								: isFavorite
									? "Remove from favorites"
									: "Add to favorites"}
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<div className="min-w-0 flex-1">
					{isEditing ? (
						<Input
							value={editingName}
							onChange={(e) => setEditingName(e.target.value)}
							onBlur={() => {
								handleRename(search.documentId, editingName);
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									handleRename(search.documentId, editingName);
								}
								if (e.key === "Escape") {
									setEditingSearchId(null);
									setEditingName("");
								}
							}}
							className="h-6 text-sm"
							disabled={isRenameLoading}
							autoFocus
							placeholder="Enter name..."
						/>
					) : (
						<button
							type="button"
							onClick={() => applySavedSearch(search)}
							className="w-full text-left"
						>
							<div className="flex items-center gap-2">
								{isRenameLoading && (
									<Loader2 className="h-3 w-3 shrink-0 animate-spin" />
								)}
								<p className="truncate font-medium text-sm">
									{hasName ? search.name : "Unnamed Search"}
								</p>
								{!hasName && (
									<Badge variant="outline" className="shrink-0 text-xs">
										Unnamed
									</Badge>
								)}
							</div>
							<p
								className="truncate text-muted-foreground text-xs"
								title={getFilterDescription(search)}
							>
								{getFilterDescription(search)}
							</p>
							<p className="truncate text-muted-foreground text-xs">
								{new Date(search.createdAt).toLocaleDateString()}
							</p>
						</button>
					)}
				</div>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="h-6 w-6 shrink-0 p-0"
							disabled={isRenameLoading}
						>
							<Edit3 className="h-3 w-3" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem
							onClick={() => {
								setEditingSearchId(search.documentId);
								setEditingName(search.name || "");
							}}
							disabled={isRenameLoading}
						>
							<Edit3 className="mr-2 h-4 w-4" />
							{hasName ? "Rename" : "Add Name"}
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="text-destructive"
							onClick={() => openDeleteDialog(search.documentId)}
						>
							<Trash2 className="mr-2 h-4 w-4" />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		);
	};

	const displaySearches = searchQuery.trim() ? filteredSaved : saved;
	const showFavorites = favoriteSaved.length > 0 && !searchQuery.trim();

	return (
		<div className="flex h-full flex-col border-r bg-muted/30">
			{/* Header */}
			<div className="border-b p-4">
				<div className="mb-3 flex items-center gap-2">
					<History className="h-4 w-4" />
					<h3 className="font-semibold text-sm">Search History</h3>
				</div>
				<Input
					placeholder="Search saved searches..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="h-8 text-sm"
				/>
				{searchQuery && (
					<Button
						variant="ghost"
						size="sm"
						className="mt-2 h-7 w-full"
						onClick={() => setSearchQuery("")}
					>
						<X className="mr-2 h-3 w-3" />
						Clear
					</Button>
				)}
			</div>

			{/* Scrollable content */}
			<ScrollArea className="flex-1">
				<div className="space-y-2 p-4">
					{loadingSaved ? (
						<div className="flex items-center justify-center py-8">
							<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
						</div>
					) : displaySearches.length === 0 ? (
						<div className="py-8 text-center text-muted-foreground text-sm">
							No saved searches found
						</div>
					) : (
						<>
							{showFavorites && (
								<div className="mb-4">
									<p className="mb-2 font-medium text-muted-foreground text-xs">
										Favorites
									</p>
									<div className="space-y-2">
										{favoriteSaved.map((search) => (
											<SavedSearchItem
												key={search.documentId}
												search={search}
											/>
										))}
									</div>
								</div>
							)}
							{showFavorites &&
								displaySearches.length > favoriteSaved.length && (
									<div className="mb-4">
										<p className="mb-2 font-medium text-muted-foreground text-xs">
											Recent
										</p>
									</div>
								)}
							<div className="space-y-2">
								{(showFavorites
									? displaySearches.filter((s) => !s.favorite)
									: displaySearches
								).map((search) => (
									<SavedSearchItem key={search.documentId} search={search} />
								))}
							</div>
						</>
					)}
				</div>
			</ScrollArea>

			{/* Load More Button */}
			{!loadingSaved && !searchQuery.trim() && hasMore && (
				<div className="border-t p-4">
					<Button
						variant="outline"
						size="sm"
						className="w-full"
						onClick={loadMore}
						disabled={loadingMore}
					>
						{loadingMore ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Loading...
							</>
						) : (
							"Load More"
						)}
					</Button>
				</div>
			)}

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Saved Search</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this saved search? This action
							cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							disabled={deleting}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{deleting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Deleting...
								</>
							) : (
								"Delete"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
