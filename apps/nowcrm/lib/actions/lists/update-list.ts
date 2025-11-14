// actions/deleteContactAction.ts
"use server";
import type { DocumentId, Form_List, List } from "@nowcrm/services";
import {
	handleError,
	listsService,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function updateList(
	id: DocumentId,
	values: Partial<Form_List>,
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
		const res = await listsService.update(id, values, session.jwt);
		return res;
	} catch (error) {
		return handleError(error);
	}
}
