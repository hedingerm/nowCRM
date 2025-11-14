// actions/deleteContactAction.ts
"use server";
import type {
	DocumentId,
	Form_Subscription,
	Subscription,
} from "@nowcrm/services";
import {
	handleError,
	type StandardResponse,
	subscriptionsService,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function updateSubscription(
	documentId: DocumentId,
	values: Partial<Form_Subscription>,
): Promise<StandardResponse<Subscription>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await subscriptionsService.update(
			documentId,
			values,
			session.jwt,
		);
		return res;
	} catch (error) {
		return handleError(error);
	}
}
