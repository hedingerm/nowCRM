// actions/deleteContactAction.ts
"use server";
import type { Industry } from "@nowcrm/services";
import {
	handleError,
	industriesService,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function createIndustry(
	name: string,
): Promise<StandardResponse<Industry>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await industriesService.create(
			{
				name: name,
				publishedAt: new Date(),
			},
			session.jwt,
		);
		return res;
	} catch (error) {
		return handleError(error);
	}
}
