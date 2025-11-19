// ContactsMassActions.tsx
"use client";

import type { DocumentId } from "@nowcrm/services";
import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/mass-actions-generator";
import { massDeleteDocuments } from "./mass-delete-docs";

// Define the actions configuration for contacts
const actionsConfig: ActionsConfig = {
	deleteContacts: {
		label: "Delete",
		onAction: async (selectedRows: DocumentId[]) => {
			return await massDeleteDocuments(selectedRows);
		},
		successMessage: "Documents deleted",
		errorMessage: "Error during deleting documents",
	},
};

// Create the MassActions component using the generator
const DocumnetsMassActions = massActionsGenerator(actionsConfig);

export default DocumnetsMassActions;
