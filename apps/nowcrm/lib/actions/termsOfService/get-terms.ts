"use server";

import type { Term } from "@nowcrm/services";
import { type StandardResponse, termsService } from "@nowcrm/services/server";
import { env } from "@/lib/config/env-config";

export async function getLatestTerms(
	_locale = "en",
): Promise<StandardResponse<Term[]>> {
	const termData = await termsService.find(env.CRM_STRAPI_API_TOKEN, {
		populate: "*",
		filters: { active: { $eq: true } },
		sort: ["id:desc"],
	});
	return termData;
}
