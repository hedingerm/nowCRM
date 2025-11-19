// ContactsMassActions.tsx
"use client";

import type { DocumentId } from "@nowcrm/services";
import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/mass-actions-generator";
import { MassRemoveTasks } from "./massDeleteTasks";

// Get your translations/messages

// Define the actions configuration for contacts
const actionsConfig: ActionsConfig = {
	deleteContacts: {
		label: "Delete", // e.g., "Delete"
		onAction: async (selectedRows: DocumentId[], contactId: DocumentId) => {
			return await MassRemoveTasks(selectedRows, contactId);
		},
		successMessage: "Tasks deleting",
		errorMessage: "Error deleting tasks",
	},
};

// Create the MassActions component using the generator
const ContactsMassActions = massActionsGenerator(actionsConfig);

export default ContactsMassActions;
