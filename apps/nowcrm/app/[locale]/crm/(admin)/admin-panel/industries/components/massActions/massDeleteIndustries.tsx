// actions/deleteContactAction.ts
"use server";

import type { DocumentId } from "@nowcrm/services";
import {
	handleError,
	industriesService,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function MassDeleteIndustries(
	industries: DocumentId[],
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
		const unpublishPromises = industries.map((id) =>
			industriesService.delete(id, session?.jwt),
		);
		await Promise.all(unpublishPromises);
		return {
			data: null,
			status: 200,
			success: true,
		};
	} catch (error) {
		return handleError(error);
	}
}
