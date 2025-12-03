"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilterDialogFooterProps {
	onCancel: () => void;
	onReset: () => void;
	onApply: () => void;
	isSubmitting?: boolean;
	isResetting?: boolean;
}

export function FilterDialogFooter({
	onCancel,
	onReset,
	onApply,
	isSubmitting = false,
	isResetting = false,
}: FilterDialogFooterProps) {
	return (
		<div className="flex items-center justify-between border-t px-6 pt-4 pb-6">
			<Button
				variant="outline"
				onClick={onCancel}
				disabled={isSubmitting || isResetting}
			>
				Cancel
			</Button>
			<div className="flex gap-2">
				<Button
					variant="outline"
					onClick={onReset}
					disabled={isSubmitting || isResetting}
				>
					{isResetting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					Reset Filters
				</Button>
				<Button onClick={onApply} disabled={isSubmitting || isResetting}>
					{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					Apply Filters
				</Button>
			</div>
		</div>
	);
}
