// actions/deleteContactAction.ts
"use server";

import type { DocumentId, List, StandardResponse } from "@nowcrm/services";
import { handleError, listsService } from "@nowcrm/services/server";
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
