// IdentitityMassActions.tsx
"use client";

import type { DocumentId } from "@nowcrm/services";
import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/mass-actions-generator";
import { MassDeleteUnipileIdentities } from "./mass-delete-unipile";

const actionsConfig: ActionsConfig = {
	deleteContacts: {
		label: "Delete", // e.g., "Delete"
		onAction: async (selectedRows: DocumentId[]) => {
			return await MassDeleteUnipileIdentities(selectedRows);
		},
		successMessage: "Identities deleted",
		errorMessage: "Error during deleting identities",
	},
};

// Create the MassActions component using the generator
const IdentitityMassActions = massActionsGenerator(actionsConfig);

export default IdentitityMassActions;
