// ContactsMassActions.tsx
"use client";

import type { DocumentId } from "@nowcrm/services";
import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/mass-actions-generator";
import { massActivateSubscriptions } from "./mass-activate-subscription";
import { massDeactivateSubscriptions } from "./mass-deactivate-subscrpition";
import { massDeleteSubscriptions } from "./mass-delete-subscription";

// Get your translations/messages

// Define the actions configuration for contacts
const actionsConfig: ActionsConfig = {
	activateSubscriptions: {
		label: "Activate",
		onAction: async (selectedRows: DocumentId[]) => {
			return await massActivateSubscriptions(selectedRows);
		},
		successMessage: "Subscriptions activated",
		errorMessage: "Error activating subscriptions",
	},
	deactivateSubscriptions: {
		label: "Deactivate",
		onAction: async (selectedRows: DocumentId[]) => {
			return await massDeactivateSubscriptions(selectedRows);
		},
		successMessage: "Subscriptions deactivated",
		errorMessage: "Error deactivating subscriptions",
	},
	deleteSubscription: {
		label: "Delete",
		onAction: async (selectedRows: DocumentId[]) => {
			return await massDeleteSubscriptions(selectedRows);
		},
		successMessage: "Subscriptions deleted",
		errorMessage: "Error deleting subscriptions",
	},
};

// Create the MassActions component using the generator
const ContactsSubscriptionsMassActions = massActionsGenerator(actionsConfig);

export default ContactsSubscriptionsMassActions;
