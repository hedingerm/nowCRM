// actions/createJobTitle.ts
"use server";
import type { ContactJobTitle } from "@nowcrm/services";
import {
	contactJobTitlesService,
	handleError,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function createJobTitle(
	name: string,
): Promise<StandardResponse<ContactJobTitle>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await contactJobTitlesService.create(
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
