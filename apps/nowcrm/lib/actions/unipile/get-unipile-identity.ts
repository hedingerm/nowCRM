// actions/deleteContactAction.ts
"use server";
import type { DocumentId, UnipileIdentity } from "@nowcrm/services";
import {
	handleError,
	type StandardResponse,
	unipileIdentitiesService,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function getUnipileIdentity(
	id: DocumentId,
): Promise<StandardResponse<UnipileIdentity>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const identity = await unipileIdentitiesService.findOne(id, session.jwt);

		return identity;
	} catch (error) {
		return handleError(error);
	}
}
