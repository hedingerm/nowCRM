// actions/deleteContactAction.ts
"use server";
import type {
	SearchHistoryTemplate,
	SearchHistoryType,
} from "@nowcrm/services";
import {
	handleError,
	type StandardResponse,
	searchHistoryTemplatesService,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function getSearchHistory(
	type: SearchHistoryType,
): Promise<StandardResponse<SearchHistoryTemplate[]>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await searchHistoryTemplatesService.find(session.jwt, {
			sort: ["id:desc"],
			filters: { type: { $eq: type } },
			pagination: { page: 1, pageSize: 10 },
		});
		return res;
	} catch (error) {
		return handleError(error);
	}
}
