// ContactsMassActions.tsx
"use client";

import type { DocumentId } from "@nowcrm/services";
import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/mass-actions-generator";
import { MassDeleteIndustries } from "./mass-delete-industries";

// Get your translations/messages

// Define the actions configuration for contacts
const actionsConfig: ActionsConfig = {
	deleteContacts: {
		label: "Delete", // e.g., "Delete"
		onAction: async (selectedRows: DocumentId[]) => {
			return await MassDeleteIndustries(selectedRows);
		},
		successMessage: "Industries deleted",
		errorMessage: "Error deleting industries",
	},
};

// Create the MassActions component using the generator
const ContactsMassActions = massActionsGenerator(actionsConfig);

export default ContactsMassActions;
