"use client";
import type { DocumentId } from "@nowcrm/services";
import {
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

export default function ExportContactsDialog({
	selectedRows,
}: {
	selectedRows: DocumentId[];
}) {
	return (
		<div>
			<DialogHeader>
				<DialogTitle>Mass Contact Export</DialogTitle>
				<DialogDescription>
					You are about to export {selectedRows.length} contacts. Are you sure?
				</DialogDescription>
			</DialogHeader>
		</div>
	);
}
