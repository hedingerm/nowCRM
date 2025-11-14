"use client";
import type { DocumentId } from "@nowcrm/services";
// IdentitityMassActions.tsx
import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/MassActionsGenerator";
import { MassDeleteTextBlocks } from "./massDeleteTextBlocks";

const actionsConfig: ActionsConfig = {
	deleteContacts: {
		label: "Delete", // e.g., "Delete"
		onAction: async (selectedRows: DocumentId[]) => {
			return await MassDeleteTextBlocks(selectedRows);
		},
		successMessage: "Text Blocks deleted",
		errorMessage: "Error deleting text blocks",
	},
};

// Create the MassActions component using the generator
const OrganizationTypeMassActions = massActionsGenerator(actionsConfig);

export default OrganizationTypeMassActions;
