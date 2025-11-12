// actions/deleteContactAction.ts
"use server";

import type { DocumentId } from "@nowcrm/services";
import {
	handleError,
	type StandardResponse,
	surveysService,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function deleteSurveyAction(
	survey: DocumentId,
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
		const response = await surveysService.delete(survey, session.jwt);
		return response;
	} catch (error) {
		return handleError(error);
	}
}
