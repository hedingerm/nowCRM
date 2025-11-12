// ContactsMassActions.tsx
"use client";

import type { DocumentId } from "@nowcrm/services";
import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/MassActionsGenerator";
import { massDeleteJourneys } from "./massDeleteJourneys";

// Get your translations/messages

// Define the actions configuration for contacts
const actionsConfig: ActionsConfig = {
	removeContacts: {
		label: "Delete", // e.g., "Delete"
		onAction: async (selectedRows: DocumentId[], journeyStepId: DocumentId) => {
			return await massDeleteJourneys(selectedRows, journeyStepId);
		},
		getExtraData: (props) => props.journeyStepId,
		successMessage: "Contacts removed from step",
		errorMessage: "Error during removing contacts",
	},
};

// Create the MassActions component using the generator
const ContactsMassActions = massActionsGenerator(actionsConfig);

export default ContactsMassActions;
