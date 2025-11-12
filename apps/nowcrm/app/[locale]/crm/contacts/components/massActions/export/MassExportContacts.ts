// actions/exportContactAction.ts
"use server";

import type { DocumentId, StandardResponse } from "@nowcrm/services";
import { contactsService, handleError } from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function MassExportContacts(
	contacts: DocumentId[],
): Promise<StandardResponse<string>> {
	const session = await auth();
	if (!session) {
		return { data: null, status: 403, success: false };
	}

	try {
		const csv = await contactsService.exportCsv(contacts, session.jwt);
		return { data: csv, status: 200, success: true };
	} catch (error) {
		return handleError(error);
	}
}
