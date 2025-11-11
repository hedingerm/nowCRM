// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";

import { DocumentId, StandardResponse } from "@nowcrm/services";
import { journeyStepsService } from "@nowcrm/services/server";
import { handleError } from "@nowcrm/services/server";

export async function massDeleteJourneys(
	contactIds: DocumentId[],
	journeyStepId: DocumentId,
): Promise<StandardResponse<null>> {
	console.log(contactIds, journeyStepId);
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		await journeyStepsService.update(journeyStepId,  {
			contacts: {
				disconnect: contactIds,
			},
		}, session.jwt);
		return {
			data: null,
			status: 200,
			success: true,
		};
	} catch (error) {
		return handleError(error);
	}
}
