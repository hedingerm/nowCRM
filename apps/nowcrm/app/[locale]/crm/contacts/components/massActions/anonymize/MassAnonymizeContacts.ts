// actions/exportContactAction.ts
"use server";

import type { DocumentId, StandardResponse } from "@nowcrm/services";
import { contactsService } from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function MassAnonymizeContacts(
	contacts: DocumentId[],
): Promise<StandardResponse<string>> {
	const session = await auth();
	if (!session) {
		return { data: null, status: 403, success: false };
	}

	try {
		for (const contactId of contacts) {
			const result = await contactsService.anonymizeContact(
				contactId,
				session.jwt,
			);
			if (!result.success) {
				return { data: null, status: 500, success: false };
			}
		}

		return { data: "Anonymization completed", status: 200, success: true };
	} catch (error) {
		console.error("Error anonymizing contacts:", error);
		return { data: null, status: 500, success: false };
	}
}
