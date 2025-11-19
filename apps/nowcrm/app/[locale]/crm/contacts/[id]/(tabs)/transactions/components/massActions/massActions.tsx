// ContactsMassActions.tsx
"use client";

import type { DocumentId } from "@nowcrm/services";
import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/mass-actions-generator";
import { massDeleteTransactions } from "./massDeleteTransactions";

// Get your translations/messages

// Define the actions configuration for contacts
const actionsConfig: ActionsConfig = {
	deleteContacts: {
		label: "Delete",
		onAction: async (selectedRows: DocumentId[]) => {
			return await massDeleteTransactions(selectedRows);
		},
		successMessage: "Transactions deleted",
		errorMessage: "Error deleting transcations",
	},
};

// Create the MassActions component using the generator
const ContactsSubscriptionsMassActions = massActionsGenerator(actionsConfig);

export default ContactsSubscriptionsMassActions;
