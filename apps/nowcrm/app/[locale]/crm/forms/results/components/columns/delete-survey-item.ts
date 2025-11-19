// actions/deleteContactAction.ts
"use server";

import type { DocumentId } from "@nowcrm/services";
import {
	handleError,
	type StandardResponse,
	surveyItemsService,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function deleteSurveyItemAction(
	surveyItemId: DocumentId,
): Promise<StandardResponse<null>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const response = await surveyItemsService.delete(surveyItemId, session.jwt);
		return response;
	} catch (error) {
		return handleError(error);
	}
}
