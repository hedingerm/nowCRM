// ContactsMassActions.tsx
"use client";

import type { DocumentId } from "@nowcrm/services";
import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/mass-actions-generator";
import { massDeleteActions } from "./mass-delete-action";

// Define the actions configuration for contacts
const actionsConfig: ActionsConfig = {
	deleteContacts: {
		label: "Delete",
		onAction: async (selectedRows: DocumentId[]) => {
			return await massDeleteActions(selectedRows);
		},
		successMessage: "Actions deleted",
		errorMessage: "Error during deleting actions",
	},
};

// Create the MassActions component using the generator
const ActionsMassActions = massActionsGenerator(actionsConfig);

export default ActionsMassActions;
