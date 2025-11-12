// actions/deleteContactAction.ts
"use server";
import { type Channel, CommunicationChannel } from "@nowcrm/services";
import {
	channelsService,
	handleError,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";
export async function getEmailChannel(): Promise<StandardResponse<Channel[]>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const channel = await channelsService.find(session.jwt, {
			filters: { name: { $eqi: CommunicationChannel.EMAIL } },
		});
		return channel;
	} catch (error) {
		return handleError(error);
	}
}
