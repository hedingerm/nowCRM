"use server";
import type { DocumentId } from "@nowcrm/services";
import {
	handleError,
	type StandardResponse,
	searchHistoryTemplatesService,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function makeFavorite(
	id: DocumentId,
	favorite: boolean,
): Promise<StandardResponse<any>> {
	const session = await auth();
	if (!session) return { data: null, status: 403, success: false };

	try {
		const res = await searchHistoryTemplatesService.update(
			id,
			{
				favorite,
			},
			session.jwt,
		);
		return res;
	} catch (error) {
		return handleError(error);
	}
}
