// JobTitlesMassActions.tsx
"use client";

import type { DocumentId } from "@nowcrm/services";
import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/mass-actions-generator";
import { MassDeleteJobTitles } from "./mass-delete-job-titles";

// Define the actions configuration for job titles
const actionsConfig: ActionsConfig = {
	deleteContacts: {
		label: "Delete",
		onAction: async (selectedRows: DocumentId[]) => {
			return await MassDeleteJobTitles(selectedRows);
		},
		successMessage: "Job titles deleted",
		errorMessage: "Error deleting job titles",
	},
};

// Create the MassActions component using the generator
const JobTitlesMassActions = massActionsGenerator(actionsConfig);

export default JobTitlesMassActions;
