"use server";
import type { Campaign, DocumentId } from "@nowcrm/services";
import {
	campaignsService,
	handleError,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";
export async function updateCampaign(
	id: DocumentId,
	name: string,
	description?: string,
	campaignCategoryId?: DocumentId,
): Promise<StandardResponse<Campaign>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await campaignsService.update(
			id,
			{
				name: name,
				description: description,
				campaign_category: campaignCategoryId
					? { connect: [campaignCategoryId] }
					: undefined,
			},
			session.jwt,
		);
		return res;
	} catch (error) {
		return handleError(error);
	}
}
