"use server";
import type { ContactTitle } from "@nowcrm/services";
import {
	contactTitlesService,
	handleError,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function createContactTitle(
	name: string,
): Promise<StandardResponse<ContactTitle>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await contactTitlesService.create(
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
