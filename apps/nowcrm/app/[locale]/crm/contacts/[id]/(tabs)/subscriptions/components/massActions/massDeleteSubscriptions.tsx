// actions/deleteContactAction.ts
"use server";

import type { DocumentId } from "@nowcrm/services";
import {
	handleError,
	type StandardResponse,
	subscriptionsService,
} from "@nowcrm/services/server";
import { auth } from "@/auth";
export async function massDeleteSubscriptions(
	subscriptions: DocumentId[],
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
		const unpublishPromises = subscriptions.map((id) =>
			subscriptionsService.delete(id, session.jwt),
		);
		await Promise.all(unpublishPromises);
		return {
			data: null,
			status: 200,
			success: true,
		};
	} catch (error) {
		console.error("Error deleting Subscription:", error);
		return handleError(error);
	}
}
