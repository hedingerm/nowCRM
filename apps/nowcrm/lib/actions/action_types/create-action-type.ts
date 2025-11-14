// actions/deleteContactAction.ts
"use server";
import type { ActionType } from "@nowcrm/services";
import {
	actionTypeService,
	handleError,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";
export async function createActionType(
	name: string,
): Promise<StandardResponse<ActionType>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}

	try {
		const res = await actionTypeService.create(
			{
				name,
				publishedAt: new Date(),
			},
			session.jwt,
		);
		return res;
	} catch (error) {
		return handleError(error);
	}
}
