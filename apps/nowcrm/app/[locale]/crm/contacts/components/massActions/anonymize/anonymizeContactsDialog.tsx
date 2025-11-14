"use client";
import type { DocumentId } from "@nowcrm/services";
import {
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

export default function anonymizeContactsDialog({
	selectedRows,
}: {
	selectedRows: DocumentId[];
}) {
	return (
		<div>
			<DialogHeader>
				<DialogTitle>Mass Contact Anonymize</DialogTitle>
				<DialogDescription>
					You are about to anonymize {selectedRows.length} contacts. Are you
					sure?
				</DialogDescription>
			</DialogHeader>
		</div>
	);
}
