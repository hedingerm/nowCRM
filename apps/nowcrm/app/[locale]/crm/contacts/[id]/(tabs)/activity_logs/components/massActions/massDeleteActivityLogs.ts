// actions/deleteContactAction.ts
"use server";

import type { DocumentId } from "@nowcrm/services";
import {
	activityLogsService,
	handleError,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function MassRemoveActivityLogs(
	activity_logs: DocumentId[],
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
		const deletePromises = activity_logs.map(
			async (id) => await activityLogsService.delete(id, session.jwt),
		);
		await Promise.all(deletePromises);
		return {
			data: null,
			status: 200,
			success: true,
		};
	} catch (error) {
		return handleError(error);
	}
}
