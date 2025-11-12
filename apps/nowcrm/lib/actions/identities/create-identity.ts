// actions/deleteContactAction.ts
"use server";
import type { Identity } from "@nowcrm/services";
import {
	handleError,
	identitiesService,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function createIdentity(
	name: string,
): Promise<StandardResponse<Identity>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}

	try {
		const res = await identitiesService.create(
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
