// ContactTitlesMassActions.tsx
"use client";

import type { DocumentId } from "@nowcrm/services";
import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/mass-actions-generator";
import { MassDeleteContactTitles } from "./mass-delete-contact";

// Define the actions configuration for contact titles
const actionsConfig: ActionsConfig = {
	deleteContacts: {
		label: "Delete",
		onAction: async (selectedRows: DocumentId[]) => {
			return await MassDeleteContactTitles(selectedRows);
		},
		successMessage: "Contact titles deleted",
		errorMessage: "Error deleting contact titles",
	},
};

// Create the MassActions component using the generator
const ContactTitlesMassActions = massActionsGenerator(actionsConfig);

export default ContactTitlesMassActions;
