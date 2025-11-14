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

export async function createSearch(
	name: string,
	type: SearchHistoryType,
	filters: string,
	query: string,
): Promise<StandardResponse<SearchHistoryTemplate>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await searchHistoryTemplatesService.create(
			{
				name,
				type,
				filters,
				query,
				publishedAt: new Date(),
			},
			session.jwt,
		);
		return res;
	} catch (error) {
		return handleError(error);
	}
}
