"use server";

import type { DocumentId } from "@nowcrm/services";
import {
	campaignCategoriesService,
	handleError,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";
export async function MassDeleteCampaignCategories(
	campaignCategories: DocumentId[],
): Promise<StandardResponse<null>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const unpublishPromises = campaignCategories.map((id) =>
			campaignCategoriesService.delete(session?.jwt, id.toString()),
		);
		await Promise.all(unpublishPromises);
		return {
			data: null,
			status: 200,
			success: true,
		};
	} catch (error) {
		return handleError(error);
	}
}
