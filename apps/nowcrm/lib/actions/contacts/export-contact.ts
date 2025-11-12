"use server";
import type { Contact, DocumentId } from "@nowcrm/services";
import {
	contactsService,
	handleError,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function exportContact(
	contactId: DocumentId,
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
		const res = await contactsService.exportUserData(contactId, session.jwt);
		return res;
	} catch (error) {
		return handleError(error);
	}
}
