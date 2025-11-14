"use server";

import type {
	CompositionScheduled,
	Form_CompositionScheduled,
} from "@nowcrm/services";
import {
	compositionScheduledsService,
	handleError,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function createScheduledCompositions(
	values: Partial<Form_CompositionScheduled>,
): Promise<StandardResponse<CompositionScheduled>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}

	try {
		const res = await compositionScheduledsService.create(values, session.jwt);
		if (!res.data || !res.success) {
			console.error(
				`Error creating scheduled composition: ${res.errorMessage}`,
			);
			return {
				data: null,
				status: 500,
				success: false,
				errorMessage: res.errorMessage,
			};
		}
		const created = await compositionScheduledsService.findOne(
			res.data.documentId,
			session.jwt,
			{
				populate: ["composition", "channel"],
			},
		);
		return created;
	} catch (error) {
		return handleError(error);
	}
}
