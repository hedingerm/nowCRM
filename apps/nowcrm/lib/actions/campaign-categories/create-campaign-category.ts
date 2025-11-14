"use server";
import type { CampaignCategory } from "@nowcrm/services";
import {
	campaignCategoriesService,
	handleError,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function createCampaignCategory(
	name: string,
	description?: string,
): Promise<StandardResponse<CampaignCategory>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await campaignCategoriesService.create(
			{
				name: name,
				description: description,
				publishedAt: new Date(),
			},
			session.jwt,
		);
		return res;
	} catch (error) {
		return handleError(error);
	}
}
