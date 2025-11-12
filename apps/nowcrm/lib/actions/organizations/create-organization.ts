// actions/deleteContactAction.ts
"use server";
import type { Form_Organization, Organization } from "@nowcrm/services";
import {
	handleError,
	organizationsService,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function createOrganization(
	values: Partial<Form_Organization>,
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
		const res = await organizationsService.create(values, session.jwt);
		return res;
	} catch (error) {
		return handleError(error);
	}
}
