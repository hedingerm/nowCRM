// actions/deleteContactAction.ts
"use server";

import type { DocumentId, StandardResponse } from "@nowcrm/services";
import { handleError, organizationsService } from "@nowcrm/services/server";
import { auth } from "@/auth";
export async function MassDisconnectContacts(
	organizationId: DocumentId,
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
		await organizationsService.update(
			organizationId,
			{
				contacts: { disconnect: contacts },
			},
			session.jwt,
		);
		return {
			data: null,
			status: 200,
			success: true,
		};
	} catch (error) {
		return handleError(error);
	}
}
