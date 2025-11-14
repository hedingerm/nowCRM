// actions/deleteContactAction.ts
"use server";

import type { DocumentId } from "@nowcrm/services";
import {
	handleError,
	mediaTypesService,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";
export async function deleteMediaTypeAction(
	mediaTypeId: DocumentId,
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
		const response = await mediaTypesService.delete(mediaTypeId, session?.jwt);
		return response;
	} catch (error) {
		return handleError(error);
	}
}
