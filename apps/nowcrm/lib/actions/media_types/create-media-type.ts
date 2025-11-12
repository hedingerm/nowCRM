// actions/deleteContactAction.ts
"use server";
import type { MediaType } from "@nowcrm/services";
import {
	handleError,
	mediaTypesService,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function createMediaType(
	name: string,
): Promise<StandardResponse<MediaType>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}

	try {
		const res = await mediaTypesService.create(
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
