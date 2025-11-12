// actions/createContactSalutation.ts
"use server";
import type { ContactSalutation } from "@nowcrm/services";
import {
	contactSalutationsService,
	handleError,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function createContactSalutation(
	name: string,
): Promise<StandardResponse<ContactSalutation>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await contactSalutationsService.create(
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
