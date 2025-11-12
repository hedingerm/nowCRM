// actions/deleteContactAction.ts
"use server";
import type { Frequency } from "@nowcrm/services";
import {
	frequenciesService,
	handleError,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function createFrequency(
	name: string,
): Promise<StandardResponse<Frequency>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}

	try {
		const res = await frequenciesService.create(
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
