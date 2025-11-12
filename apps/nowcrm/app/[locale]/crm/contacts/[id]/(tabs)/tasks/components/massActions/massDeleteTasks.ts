// actions/deleteContactAction.ts
"use server";

import type { DocumentId } from "@nowcrm/services";
import {
	handleError,
	type StandardResponse,
	tasksService,
} from "@nowcrm/services/server";
import { auth } from "@/auth";
export async function MassRemoveTasks(
	tasks: DocumentId[],
	_contactId: DocumentId,
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
		tasks.map(async (id) => await tasksService.delete(id, session.jwt));
		return {
			data: null,
			status: 200,
			success: true,
		};
	} catch (error) {
		return handleError(error);
	}
}
