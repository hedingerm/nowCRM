// actions/deleteContactAction.ts
"use server";

import type { DocumentId } from "@nowcrm/services";
import {
	actionsService,
	handleError,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function massDeleteActions(
	actions: DocumentId[],
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
		const unpublishPromises = actions.map((id) =>
			actionsService.delete(id, session.jwt),
		);
		await Promise.all(unpublishPromises);
		return {
			data: null,
			status: 200,
			success: true,
		};
	} catch (error: any) {
		return handleError(error);
	}
}
