"use client";
import type { DocumentId } from "@nowcrm/services";
import {
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

export default function DeleteContactsDialog({
	selectedRows,
	count,
}: {
	selectedRows?: DocumentId[];
	count?: number;
}) {
	const howMany =
		typeof count === "number"
			? count
			: Array.isArray(selectedRows)
				? selectedRows.length
				: 0;

	return (
		<div>
			<DialogHeader>
				<DialogTitle>Mass Contact Deletion</DialogTitle>
				<DialogDescription>
					You are about to delete {howMany} contacts. Are you sure?
				</DialogDescription>
			</DialogHeader>
		</div>
	);
}
