"use server";

import type {
	CompositionScheduled,
	DocumentId,
	Form_CompositionScheduled,
} from "@nowcrm/services";
import {
	compositionScheduledsService,
	handleError,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function updateScheduledCompositions(
	id: DocumentId,
	values: Partial<Form_CompositionScheduled>,
): Promise<StandardResponse<CompositionScheduled>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
			errorMessage: "Unauthorized",
		};
	}

	try {
		const res = await compositionScheduledsService.update(
			id,
			values,
			session.jwt,
		);
		return res;
	} catch (error) {
		return handleError(error);
	}
}
