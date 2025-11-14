"use server";
import type { ContactSalutation, DocumentId } from "@nowcrm/services";
import {
	contactSalutationsService,
	handleError,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";
export async function updateContactSalutation(
	id: DocumentId,
	name: string,
): Promise<StandardResponse<ContactSalutation>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await contactSalutationsService.update(
			id,
			{
				name: name,
			},
			session.jwt,
		);
		return res;
	} catch (error) {
		return handleError(error);
	}
}
