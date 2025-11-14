"use server";
import type { DocumentId } from "@nowcrm/services";
import {
	contactSalutationsService,
	handleError,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function deleteContactSalutationAction(
	id: DocumentId,
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
		const res = await contactSalutationsService.delete(id, session.jwt);
		return res;
	} catch (error) {
		return handleError(error);
	}
}
