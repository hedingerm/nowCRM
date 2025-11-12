"use server";

import type { DocumentId } from "@nowcrm/services";
import {
	contactsService,
	handleError,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function duplicateContactAction(
	contactId: DocumentId,
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
		const response = await contactsService.duplicate(contactId, session.jwt);
		return response;
	} catch (error) {
		return handleError(error);
	}
}
