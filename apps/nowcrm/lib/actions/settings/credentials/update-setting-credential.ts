// actions/deleteContactAction.ts
"use server";
import type {
	DocumentId,
	Form_SettingCredential,
	SettingCredential,
} from "@nowcrm/services";
import {
	handleError,
	type StandardResponse,
	settingCredentialsService,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function updateSettingCredentials(
	id: DocumentId,
	values: Partial<Form_SettingCredential>,
): Promise<StandardResponse<SettingCredential>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await settingCredentialsService.update(id, values, session.jwt);
		return res;
	} catch (error) {
		return handleError(error);
	}
}
