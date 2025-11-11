// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import { handleError } from "@nowcrm/services/server";
import type { StandardResponse } from "@nowcrm/services";
import type { sendToChannelsData } from "@nowcrm/services/client";
import { composerService } from "@nowcrm/services/server";


export async function sendToChannelAction(
	data: sendToChannelsData,
): Promise<StandardResponse<{ result: string }>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}

	try {
		const response = await composerService.sendComposition(data);
		return response
	} catch (_error: any) {
		return handleError(_error);
	}
}
