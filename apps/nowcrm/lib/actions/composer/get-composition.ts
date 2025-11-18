// actions/deleteContactAction.ts
"use server";
import type { Composition, DocumentId } from "@nowcrm/services";
import {
	compositionsService,
	handleError,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function getComposition(
	id: DocumentId,
): Promise<StandardResponse<Composition>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const identity = await compositionsService.findOne(id, session.jwt, {
			populate: {
				composition_items: {
					populate: "channel",
				},
			},
		});
		return identity;
	} catch (error) {
		return handleError(error);
	}
}
