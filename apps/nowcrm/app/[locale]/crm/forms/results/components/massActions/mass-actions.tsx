// ContactsMassActions.tsx
"use client";

import type { DocumentId } from "@nowcrm/services";
import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/mass-actions-generator";
import { MassDeleteSurveyItems } from "./mass-delete-forms";

// Get your translations/messages

// Define the actions configuration for contacts
const actionsConfig: ActionsConfig = {
	deleteContacts: {
		label: "Delete", // e.g., "Delete"
		onAction: async (selectedRows: DocumentId[]) => {
			return await MassDeleteSurveyItems(selectedRows);
		},
		successMessage: "Survey Item deleted",
		errorMessage: "Error during deleting lists",
	},
};

// Create the MassActions component using the generator
const surveyItemsMassActions = massActionsGenerator(actionsConfig);

export default surveyItemsMassActions;
