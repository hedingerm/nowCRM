// actions/deleteContactAction.ts
"use server";

import type { DocumentId } from "@nowcrm/services";
import {
	handleError,
	type StandardResponse,
	subscriptionsService,
} from "@nowcrm/services/server";
import { auth } from "@/auth";
export async function deleteSubscriptionAction(
	subscriptionId: DocumentId,
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
		const response = await subscriptionsService.delete(
			subscriptionId,
			session.jwt,
		);
		return response;
	} catch (error) {
		return handleError(error);
	}
}
