// actions/deleteContactAction.ts
"use server";

import type { DocumentId, StandardResponse } from "@nowcrm/services";
import { contactsService, handleError } from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function MassDeleteContacts(
	contacts: DocumentId[],
): Promise<StandardResponse<null>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const unpublishPromises = contacts.map((id) =>
			contactsService.delete(id, session.jwt),
		);
		await Promise.all(unpublishPromises);
		return {
			data: null,
			status: 200,
			success: true,
		};
	} catch (error) {
		return handleError(error);
	}
}
