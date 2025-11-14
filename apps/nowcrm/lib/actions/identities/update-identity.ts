// actions/deleteContactAction.ts
"use server";
import type { DocumentId, Form_Identity, Identity } from "@nowcrm/services";
import {
	handleError,
	identitiesService,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function updateIdentity(
	id: DocumentId,
	values: Partial<Form_Identity>,
): Promise<StandardResponse<Identity>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await identitiesService.update(id, values, session.jwt);
		return res;
	} catch (error) {
		return handleError(error);
	}
}
