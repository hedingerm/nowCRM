// actions/deleteContactAction.ts
"use server";
import type { DocumentId, Organization } from "@nowcrm/services";
import {
	handleError,
	organizationsService,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function addContactToOrganization(
	organizationId: DocumentId,
	contactId: DocumentId,
): Promise<StandardResponse<Organization>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	console.log(organizationId, contactId);
	try {
		const res = await organizationsService.update(
			organizationId,
			{
				contacts: { connect: [contactId] },
			},
			session.jwt,
		);
		return res;
	} catch (error) {
		return handleError(error);
	}
}
