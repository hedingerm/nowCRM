// contactsapp/lib/actions/contacts/createContact.ts
"use server";
import type { Contact, Form_Contact } from "@nowcrm/services";
import {
	contactsService,
	handleError,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function createContact(
	values: Partial<Form_Contact>,
): Promise<StandardResponse<Contact>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await contactsService.create(values, session.jwt);
		return res;
	} catch (error) {
		return handleError(error);
	}
}
