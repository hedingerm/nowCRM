// actions/deleteContactAction.ts
"use server";

import type { DocumentId } from "@nowcrm/services";
import {
	handleError,
	organizationsService,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function deleteOrganizationAction(
	orgId: DocumentId,
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
		const response = await organizationsService.delete(orgId, session.jwt);
		return response;
	} catch (error) {
		return handleError(error);
	}
}
