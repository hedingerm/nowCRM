"use server";
import type { CampaignCategory, DocumentId } from "@nowcrm/services";
import {
	campaignCategoriesService,
	handleError,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";
export async function updateCampaignCategory(
	id: DocumentId,
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
		const res = await campaignCategoriesService.update(
			id,
			{
				name: name,
				description: description,
			},
			session.jwt,
		);
		return res;
	} catch (error) {
		return handleError(error);
	}
}
