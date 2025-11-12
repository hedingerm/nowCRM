"use server";
import type { CampaignCategory } from "@nowcrm/services";
import {
	campaignCategoriesService,
	handleError,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function getCampaignCategories(): Promise<
	StandardResponse<CampaignCategory[]>
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
		const res = await campaignCategoriesService.find(session.jwt, {
			pagination: { page: 1, pageSize: 100 },
			sort: ["name:asc"],
		});
		return res;
	} catch (error) {
		return handleError(error);
	}
}
