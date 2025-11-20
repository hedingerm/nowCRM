"use client";
import type { DocumentId } from "@nowcrm/services";
import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/mass-actions-generator";
import { MassDeleteFrequencies } from "./mass-delete-frequencies";

const actionsConfig: ActionsConfig = {
	deleteContacts: {
		label: "Delete", // e.g., "Delete"
		onAction: async (selectedRows: DocumentId[]) => {
			return await MassDeleteFrequencies(selectedRows);
		},
		successMessage: "Frequencies deleted",
		errorMessage: "Error deleting frequencies",
	},
};

// Create the MassActions component using the generator
const FrequencyMassActions = massActionsGenerator(actionsConfig);

export default FrequencyMassActions;
