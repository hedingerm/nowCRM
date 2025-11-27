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
	Save,
	Star,
	StarOff,
	Trash2,
} from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { createSearch } from "@/lib/actions/search_history/create-search";
import { deleteSearch } from "@/lib/actions/search_history/delete-search";
import { getSearchHistory } from "@/lib/actions/search_history/get-search-history";
import { makeFavorite } from "@/lib/actions/search_history/make-favorite-search";
import { updateSearchHistoryTemplate } from "@/lib/actions/search_history/update-search-history-template";

interface SearchHistoryProps {
	entityType: SearchHistoryType;
	currentFilters?: any;
	currentSearch?: string;
	onApplySearch: (filters: any, search?: string) => void;
}

export function SearchHistory({
	entityType,
	currentFilters,
	currentSearch,
	onApplySearch,
}: SearchHistoryProps) {
	const [open, setOpen] = React.useState(false);
	const [saved, setSaved] = React.useState<SearchHistoryTemplate[]>([]);
	const [loadingSaved, setLoadingSaved] = React.useState(false);
	const [_saveDialogOpen, setSaveDialogOpen] = React.useState(false);
	const [newSearchName, setNewSearchName] = React.useState("");
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

	const filteredSaved = React.useMemo(() => {
		if (!searchQuery.trim()) return saved;
		const query = searchQuery.toLowerCase();
		return saved.filter((search) => search.name.toLowerCase().includes(query));
	}, [saved, searchQuery]);

	const favoriteSaved = React.useMemo(
		() => filteredSaved.filter((search) => search.favorite === true),
		[filteredSaved],
	);

	// Load saved searches when dialog opens
	React.useEffect(() => {
		if (!open) return;

		let mounted = true;
		(async () => {
			setLoadingSaved(true);
			const res = await getSearchHistory(entityType);
			if (mounted && res?.success && Array.isArray(res.data)) {
				setSaved(res.data);
			}
			setLoadingSaved(false);
		})();
		return () => {
			mounted = false;
		};
	}, [open, entityType]);

	async function handleSaveCurrent() {
		if (!newSearchName.trim()) return;

		const filtersPayload = JSON.stringify({
			ui: currentFilters,
			strapiFilters: currentFilters,
		});

		const res = await createSearch(
			newSearchName.trim(),
			entityType,
			filtersPayload,
			currentSearch || "",
		);

		if (res?.success) {
			const listed = await getSearchHistory(entityType);
			if (listed?.success && Array.isArray(listed.data)) {
				setSaved(listed.data);
			}
			setNewSearchName("");
			setSaveDialogOpen(false);
		} else {
			console.error("Failed to save search:", res?.errorMessage);
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

				const refreshed = await getSearchHistory(entityType);
				if (refreshed?.success && Array.isArray(refreshed.data)) {
					setSaved(refreshed.data);
				}
			} else {
				console.error("Failed to update favorite status:", res?.errorMessage);
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

	function applySavedSearch(search: SearchHistoryTemplate) {
		let stored: any = {};
		try {
			stored = JSON.parse((search.filters as string) || "{}");
		} catch {}

		const strapiFilters = stored.strapiFilters || stored.ui || {};

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

		onApplySearch(strapiFilters, query);
		setOpen(false);
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

				const refreshed = await getSearchHistory(entityType);
				if (refreshed?.success && Array.isArray(refreshed.data)) {
					setSaved(refreshed.data);
				}
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

	async function handleDelete(searchId: DocumentId) {
		if (
			!confirm(
				"Are you sure you want to delete this saved search? This action cannot be undone.",
			)
		) {
			return;
		}

		const res = await deleteSearch(searchId);
		if (res?.success) {
			const listed = await getSearchHistory(entityType);
			if (listed?.success && Array.isArray(listed.data)) {
				setSaved(listed.data);
			}
		} else {
			console.error("Failed to delete search");
		}
	}

	const SavedSearchItem = ({ search }: { search: SearchHistoryTemplate }) => {
		const isFavorite = search.favorite === true;
		const isEditing = editingSearchId === search.documentId;
		const isFavoriteLoading = favoriteLoading.has(search.documentId);
		const isRenameLoading = renameLoading.has(search.documentId);

		return (
			<div className="flex items-center gap-2 rounded-md border p-2 transition-colors hover:bg-muted/50">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="h-6 w-6 p-0"
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
						/>
					) : (
						<button
							type="button"
							onClick={() => applySavedSearch(search)}
							className="w-full text-left"
						>
							<div className="flex items-center gap-2">
								{isRenameLoading && (
									<Loader2 className="h-3 w-3 animate-spin" />
								)}
								<p className="truncate font-medium text-sm">{search.name}</p>
							</div>
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
							className="h-6 w-6 p-0"
							disabled={isRenameLoading}
						>
							<Edit3 className="h-3 w-3" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem
							onClick={() => {
								setEditingSearchId(search.documentId);
								setEditingName(search.name);
							}}
							disabled={isRenameLoading}
						>
							<Edit3 className="mr-2 h-4 w-4" />
							Rename
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="text-destructive"
							onClick={() => handleDelete(search.documentId)}
						>
							<Trash2 className="mr-2 h-4 w-4" />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm" className="h-10">
					<History className="mr-2 h-4 w-4" />
					<span className="hidden md:inline">Search History</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="flex h-[80vh] max-w-2xl flex-col">
				<DialogHeader>
					<DialogTitle>Search History</DialogTitle>
					<DialogDescription>
						Save and manage your search filters and queries
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-1 flex-col gap-4">
					{/* Save current search */}
					<div className="flex items-center gap-2 border-b pb-4">
						<Input
							placeholder="Save current search as..."
							value={newSearchName}
							onChange={(e) => setNewSearchName(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter" && newSearchName.trim()) {
									handleSaveCurrent();
								}
							}}
							className="flex-1"
						/>
						<Button
							onClick={handleSaveCurrent}
							disabled={!newSearchName.trim()}
							size="sm"
						>
							<Save className="mr-2 h-4 w-4" />
							Save
						</Button>
					</div>

					{/* Search saved searches */}
					<div className="flex items-center gap-2">
						<Input
							placeholder="Search saved searches..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="flex-1"
						/>
					</div>

					{/* Saved searches list */}
					{loadingSaved ? (
						<div className="flex flex-1 items-center justify-center">
							<Loader2 className="h-6 w-6 animate-spin" />
							<span className="ml-2 text-muted-foreground text-sm">
								Loading...
							</span>
						</div>
					) : (
						<Tabs defaultValue="all" className="flex flex-1 flex-col">
							<TabsList className="grid w-full grid-cols-2">
								<TabsTrigger value="all">
									All ({filteredSaved.length})
								</TabsTrigger>
								<TabsTrigger value="favorites">
									<Star className="mr-1 h-3 w-3" />
									Favorites ({favoriteSaved.length})
								</TabsTrigger>
							</TabsList>

							<TabsContent value="all" className="mt-4 flex-1">
								<ScrollArea className="h-full">
									<div className="space-y-2">
										{filteredSaved.length === 0 ? (
											<p className="py-4 text-center text-muted-foreground text-sm">
												{searchQuery
													? "No searches match your query"
													: "No saved searches yet"}
											</p>
										) : (
											filteredSaved.map((search) => (
												<SavedSearchItem
													key={search.documentId}
													search={search}
												/>
											))
										)}
									</div>
								</ScrollArea>
							</TabsContent>

							<TabsContent value="favorites" className="mt-4 flex-1">
								<ScrollArea className="h-full">
									<div className="space-y-2">
										{favoriteSaved.length === 0 ? (
											<p className="py-4 text-center text-muted-foreground text-sm">
												No favorite searches yet
											</p>
										) : (
											favoriteSaved.map((search) => (
												<SavedSearchItem
													key={search.documentId}
													search={search}
												/>
											))
										)}
									</div>
								</ScrollArea>
							</TabsContent>
						</Tabs>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
