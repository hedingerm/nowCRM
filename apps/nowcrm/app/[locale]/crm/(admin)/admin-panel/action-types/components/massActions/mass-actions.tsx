"use client";
import type { DocumentId } from "@nowcrm/services";
// IdentitityMassActions.tsx
import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/mass-actions-generator";
import { MassDeleteActionTypes } from "./mass-delete-action-type";

const actionsConfig: ActionsConfig = {
	deleteActionTypes: {
		label: "Delete",
		onAction: async (selectedRows: DocumentId[]) => {
			return await MassDeleteActionTypes(selectedRows);
		},
		successMessage: "Action Type deleted",
		errorMessage: "Error deleting action type",
	},
};

// Create the MassActions component using the generator
const OrganizationTypeMassActions = massActionsGenerator(actionsConfig);

export default OrganizationTypeMassActions;
