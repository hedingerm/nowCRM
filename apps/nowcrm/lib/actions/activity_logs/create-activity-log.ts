// actions/deleteContactAction.ts
"use server";
import type { ActivityLog, Form_ActivityLog } from "@nowcrm/services";

import {
	activityLogsService,
	handleError,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function createActivityLog(
	values: Partial<Form_ActivityLog>,
): Promise<StandardResponse<ActivityLog>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}

	try {
		const res = await activityLogsService.create(
			{
				...values,
				user: session.user.strapi_id,
			},
			session.jwt,
		);
		return res;
	} catch (error) {
		return handleError(error);
	}
}
