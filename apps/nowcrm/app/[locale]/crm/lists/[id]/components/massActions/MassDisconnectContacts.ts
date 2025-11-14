// actions/deleteContactAction.ts
"use server";

import type { DocumentId } from "@nowcrm/services";
import {
	handleError,
	listsService,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function MassDisconnectContacts(
	listId: DocumentId,
	contacts: DocumentId[],
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
		await listsService.update(
			listId,
			{ contacts: { disconnect: contacts } },
			session.jwt,
		);
		return {
			data: null,
			status: 200,
			success: true,
		};
	} catch (error) {
		return handleError(error);
	}
}
