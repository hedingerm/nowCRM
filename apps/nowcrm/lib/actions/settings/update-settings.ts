// actions/deleteContactAction.ts
"use server";
import type { DocumentId, Form_Setting, Setting } from "@nowcrm/services";
import {
	handleError,
	type StandardResponse,
	settingsService,
} from "@nowcrm/services/server";
import { auth } from "@/auth";
export async function updateSettings(
	id: DocumentId,
	values: Partial<Form_Setting>,
): Promise<StandardResponse<Setting>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await settingsService.update(id, values, session.jwt);
		return res;
	} catch (error) {
		return handleError(error);
	}
}
