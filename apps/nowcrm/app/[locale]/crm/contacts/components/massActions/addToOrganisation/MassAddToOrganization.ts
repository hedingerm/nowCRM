// actions/deleteContactAction.ts
"use server";

import type {
	DocumentId,
	Organization,
	StandardResponse,
} from "@nowcrm/services";
import { handleError, organizationsService } from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function MassAddToOrganization(
	contactIds: DocumentId[],
	organization_id: DocumentId,
): Promise<StandardResponse<Organization>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await organizationsService.update(
			organization_id,
			{
				contacts: { connect: contactIds },
			},
			session.jwt,
		);
		return res;
	} catch (error) {
		return handleError(error);
	}
}
