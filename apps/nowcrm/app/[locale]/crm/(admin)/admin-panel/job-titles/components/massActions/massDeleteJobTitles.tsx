"use server";

import type { DocumentId } from "@nowcrm/services";
import {
	contactJobTitlesService,
	handleError,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";
export async function MassDeleteJobTitles(
	jobTitles: DocumentId[],
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
		const unpublishPromises = jobTitles.map((id) =>
			contactJobTitlesService.delete(id, session?.jwt),
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
