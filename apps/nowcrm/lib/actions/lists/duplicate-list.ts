"use server";

import type { DocumentId } from "@nowcrm/services";
import {
	handleError,
	listsService,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function duplicateListAction(
	listId: DocumentId,
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
		const response = await listsService.duplicate(listId, session.jwt);
		return response;
	} catch (error) {
		return handleError(error);
	}
}
