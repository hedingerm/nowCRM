// actions/deleteContactAction.ts
"use server";

import type { DocumentId, List } from "@nowcrm/services";
import {
	handleError,
	listsService,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function MassAddToList(
	contactIds: DocumentId[],
	listId: DocumentId,
): Promise<StandardResponse<List>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await listsService.update(
			listId,
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
