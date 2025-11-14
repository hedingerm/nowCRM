"use client";
import type { DocumentId } from "@nowcrm/services";
// IdentitityMassActions.tsx
import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/MassActionsGenerator";
import { MassDeleteMediaTypes } from "./massDeleteMediaType";

const actionsConfig: ActionsConfig = {
	deleteContacts: {
		label: "Delete", // e.g., "Delete"
		onAction: async (selectedRows: DocumentId[]) => {
			return await MassDeleteMediaTypes(selectedRows);
		},
		successMessage: "Media Type deleted",
		errorMessage: "Error deleting media type",
	},
};

// Create the MassActions component using the generator
const MediaTypeMassActions = massActionsGenerator(actionsConfig);

export default MediaTypeMassActions;
