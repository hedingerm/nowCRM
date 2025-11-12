"use client";
import type { DocumentId } from "@nowcrm/services";
// IdentitityMassActions.tsx
import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/MassActionsGenerator";
import { MassDeleteIdentities } from "./massDeleteIdentities";

const actionsConfig: ActionsConfig = {
	deleteContacts: {
		label: "Delete", // e.g., "Delete"
		onAction: async (selectedRows: DocumentId[]) => {
			return await MassDeleteIdentities(selectedRows);
		},
		successMessage: "Identities deleted",
		errorMessage: "Error deleting identities",
	},
};

// Create the MassActions component using the generator
const IdentitityMassActions = massActionsGenerator(actionsConfig);

export default IdentitityMassActions;
