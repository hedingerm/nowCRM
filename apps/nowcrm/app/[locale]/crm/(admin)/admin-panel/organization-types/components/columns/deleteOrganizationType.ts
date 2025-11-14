// actions/deleteContactAction.ts
"use server";

import type { DocumentId } from "@nowcrm/services";
import {
	handleError,
	organizationTypesService,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function deleteOrganizationTypeAction(
	organizationTypeId: DocumentId,
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
		const response = await organizationTypesService.delete(
			organizationTypeId,
			session?.jwt,
		);
		return response;
	} catch (error) {
		return handleError(error);
	}
}
