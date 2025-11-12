// actions/deleteContactAction.ts
"use server";
import type { DocumentId, SettingCredential } from "@nowcrm/services";
import {
	handleError,
	type StandardResponse,
	settingCredentialsService,
} from "@nowcrm/services/server";
import { auth } from "@/auth";
export async function createSettingCredential(
	name: string,
	settings: DocumentId,
): Promise<StandardResponse<SettingCredential>> {
	const session = await auth();
	if (!session) return { data: null, status: 403, success: false };

	try {
		const res = await settingCredentialsService.create(
			{
				name: name,
				setting: settings,
				credential_status: "disconnected",
				publishedAt: new Date(),
			},
			session.jwt,
		);
		return res;
	} catch (error) {
		return handleError(error);
	}
}
