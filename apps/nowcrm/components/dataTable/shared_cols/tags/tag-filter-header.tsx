"use client";

import type { Tag } from "@nowcrm/services";
import type { Session } from "next-auth";
import { Filter, TagIcon, X } from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchTags } from "@/lib/actions/tags/fetch-tags";

interface TagFilterHeaderProps {
	session?: Session | null;
	selectedTag?: string | null;
	onTagChange?: (tagId: string | null) => void;
	entityName?: string; // Entity name for localStorage key (e.g., "contacts", "organizations")
}

export function TagFilterHeader({
	session,
	selectedTag: externalSelectedTag,
	onTagChange,
	entityName = "organizations", // Default to organizations for backward compatibility
}: TagFilterHeaderProps) {
	const [tags, setTags] = useState<Tag[]>([]);
	
	// Get localStorage key for tag filter
	const tagFilterKey = React.useMemo(() => {
		const userId = session?.user?.strapi_id || session?.user?.email || "anonymous";
		return `filters.tag.${entityName}.${userId}`;
	}, [session, entityName]);

	// Load selected tag from localStorage if not provided externally
	const [internalSelectedTag, setInternalSelectedTag] = useState<string | null>(() => {
		if (externalSelectedTag !== undefined) {
			return externalSelectedTag;
		}
		if (typeof window === "undefined") {
			return null;
		}
		try {
			const stored = localStorage.getItem(tagFilterKey);
			return stored || null;
		} catch {
			return null;
		}
	});

	const selectedTag = externalSelectedTag !== undefined ? externalSelectedTag : internalSelectedTag;

	useEffect(() => {
		const fetchAndSetTags = async () => {
			try {
				const res = await fetchTags();
				setTags(res.data || []);
			} catch (e) {
				console.error("Failed to fetch tags", e);
			}
		};
		fetchAndSetTags();
	}, []);

	const handleSelect = (tagId: string | null) => {
		if (onTagChange) {
			// If parent provides callback, use it
			onTagChange(tagId);
		} else {
			// Otherwise, manage internally with localStorage
			setInternalSelectedTag(tagId);
			try {
				if (tagId) {
					localStorage.setItem(tagFilterKey, tagId);
				} else {
					localStorage.removeItem(tagFilterKey);
				}
				// Trigger a custom event so the table can refetch
				window.dispatchEvent(new CustomEvent("tagFilterChanged"));
			} catch {
				// Ignore localStorage errors
			}
		}
	};

	const selectedTagData = tags.find(
		(t) => String(t.documentId) === selectedTag,
	);

	return (
		<div className="flex items-center gap-2">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="sm"
						className="h-8 border-2 border-dashed px-2 transition-colors hover:bg-accent/50 lg:px-3"
					>
						<Filter className="mr-2 h-4 w-4" />
						<span className="font-medium">Tags</span>
						{selectedTagData && (
							<div className="ml-2 flex items-center gap-1">
								<Badge
									variant="secondary"
									className="rounded-full px-2 py-0.5 font-medium text-xs"
									style={{
										backgroundColor: `${selectedTagData.color}20`,
										color: selectedTagData.color,
										border: `1px solid ${selectedTagData.color}40`,
									}}
								>
									{selectedTagData.name}
								</Badge>
							</div>
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start" className="w-56">
					<DropdownMenuLabel className="flex items-center gap-2">
						<TagIcon className="h-4 w-4" />
						Filter by Tag
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => handleSelect(null)}
						className="flex items-center gap-2"
					>
						<div className="h-3 w-3 rounded-full bg-muted-foreground/20" />
						All Tags
					</DropdownMenuItem>
					{tags.map((tag) => (
						<DropdownMenuItem
							key={tag.documentId}
							onClick={() => handleSelect(tag.documentId)}
							className="flex items-center gap-2"
						>
							<div
								className="h-3 w-3 rounded-full"
								style={{ backgroundColor: tag.color }}
							/>
							<span className="flex-1">{tag.name}</span>
							{selectedTag === tag.documentId && (
								<div className="h-2 w-2 rounded-full bg-primary" />
							)}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>

			{selectedTag && (
				<Button
					variant="ghost"
					size="sm"
					onClick={() => handleSelect(null)}
					className="h-8 px-2 text-muted-foreground hover:text-foreground"
				>
					<X className="h-4 w-4" />
				</Button>
			)}
		</div>
	);
}
