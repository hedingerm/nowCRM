// actions/deleteContactAction.ts
"use server";

import type { DocumentId } from "@nowcrm/services";
import {
	handleError,
	type StandardResponse,
	tagsService,
} from "@nowcrm/services/server";
import { auth } from "@/auth";
export async function deleteTag(
	tagId: DocumentId,
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
		const response = await tagsService.delete(tagId, session?.jwt);
		return response;
	} catch (error) {
		return handleError(error);
	}
}
