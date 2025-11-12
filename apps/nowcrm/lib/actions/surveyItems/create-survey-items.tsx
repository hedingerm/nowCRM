"use server";

import type { Form_SurveyItem, SurveyItem } from "@nowcrm/services";
import {
	handleError,
	type StandardResponse,
	surveyItemsService,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function createSurveyItem(
	values: Pick<Form_SurveyItem, "question" | "answer" | "survey">,
): Promise<StandardResponse<SurveyItem>> {
	const session = await auth();

	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}

	try {
		const res = await surveyItemsService.create(
			{
				...values,
				publishedAt: new Date(),
			},
			session.jwt,
		);
		return res;
	} catch (error) {
		return handleError(error);
	}
}
