// actions/deleteContactAction.ts
"use server";

import type {
	DocumentId,
	JourneyStep,
	StandardResponse,
} from "@nowcrm/services";
import { handleError, journeyStepsService } from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function MassAddToJourney(
	contactIds: DocumentId[],
	journeyId: DocumentId,
): Promise<StandardResponse<JourneyStep>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await journeyStepsService.update(
			journeyId,
			{
				contacts: { connect: contactIds },
			},
			session.jwt,
		);
		return res;
	} catch (error) {
		return handleError(error);
	}
}
