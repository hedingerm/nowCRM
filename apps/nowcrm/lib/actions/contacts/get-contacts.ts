// actions/deleteContactAction.ts
"use server";
import type { Contact, StrapiQuery } from "@nowcrm/services";
import {
	contactsService,
	handleError,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function getContacts(
	filters: StrapiQuery<Contact>,
): Promise<StandardResponse<Contact[]>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await contactsService.find(session.jwt, filters);
		return res;
	} catch (error) {
		return handleError(error);
	}
}
