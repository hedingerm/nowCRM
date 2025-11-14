// actions/deleteContactAction.ts
"use server";
import type { DocumentId } from "@nowcrm/services";
import {
	dalService,
	handleError,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";
export async function addContactsToJourneyByFilters(
	filters: Record<string, any>,
	journey_id: DocumentId,
): Promise<StandardResponse<any>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}

	try {
		const res = await dalService.addContactsToJourneyByFilters(
			filters,
			journey_id,
		);

		return res;
	} catch (error) {
		return handleError(error);
	}
}
