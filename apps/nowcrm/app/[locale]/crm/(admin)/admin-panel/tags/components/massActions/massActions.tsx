"use client";
import type { DocumentId } from "@nowcrm/services";
// IdentitityMassActions.tsx
import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/MassActionsGenerator";
import { MassDeleteTags } from "./massDeleteTags";

const actionsConfig: ActionsConfig = {
	deleteContacts: {
		label: "Delete", // e.g., "Delete"
		onAction: async (selectedRows: DocumentId[]) => {
			return await MassDeleteTags(selectedRows);
		},
		successMessage: "Tags deleted",
		errorMessage: "Error deleting Tags",
	},
};

// Create the MassActions component using the generator
const TagMassActions = massActionsGenerator(actionsConfig);

export default TagMassActions;
