// actions/deleteContactAction.ts
"use server";
import type { Tag } from "@nowcrm/services";
import {
	handleError,
	type StandardResponse,
	tagsService,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function fetchTags(): Promise<StandardResponse<Tag[]>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}

	try {
		const res = await tagsService.find(session.jwt, { sort: ["id:desc"] });
		return res;
	} catch (error) {
		return handleError(error);
	}
}
