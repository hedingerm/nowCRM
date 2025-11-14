// actions/deleteContactAction.ts
"use server";
import type { Journey } from "@nowcrm/services";
import {
	handleError,
	journeysService,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function createJourney(
	name: string,
): Promise<StandardResponse<Journey>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await journeysService.create(
			{
				name: name,
				active: false,
				publishedAt: new Date(),
			},
			session.jwt,
		);
		return res;
	} catch (error) {
		return handleError(error);
	}
}
