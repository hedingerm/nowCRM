// actions/deleteContactAction.ts
"use server";
import type { Contact, DocumentId, Form_Contact } from "@nowcrm/services";
import {
	contactsService,
	handleError,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function updateContact(
	id: DocumentId,
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
		const res = await contactsService.update(id, values, session.jwt);
		return res;
	} catch (error) {
		return handleError(error);
	}
}
