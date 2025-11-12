// actions/deleteContactAction.ts
"use server";
import type { CompositionItem } from "@nowcrm/services";
import {
	compositionItemsService,
	handleError,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function getCompositionItems(): Promise<
	StandardResponse<CompositionItem[]>
> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const item = await compositionItemsService.find(session.jwt, {
			populate: {
				composition: "*",
				channel: "*",
			},
		});
		return item;
	} catch (error) {
		return handleError(error);
	}
}
