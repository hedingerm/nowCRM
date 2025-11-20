// ContactsMassActions.tsx
"use client";

import type { DocumentId } from "@nowcrm/services";
import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/mass-actions-generator";
import { MassRemoveLists } from "./mass-remove-list";

// Get your translations/messages

// Define the actions configuration for contacts
const actionsConfig: ActionsConfig = {
	deleteContacts: {
		label: "Remove", // e.g., "Delete"
		onAction: async (selectedRows: DocumentId[], contactId: DocumentId) => {
			return await MassRemoveLists(selectedRows, contactId);
		},
		successMessage: "Lists disconnected",
		errorMessage: "Error during disconecting lists",
	},
};

// Create the MassActions component using the generator
const ContactsMassActions = massActionsGenerator(actionsConfig);

export default ContactsMassActions;
