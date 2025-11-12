// actions/deleteContactAction.ts
"use server";
import { handleError, type StandardResponse } from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function getUserIdentity(): Promise<StandardResponse<string>> {
	try {
		const session = await auth();
		if (!session) {
			return {
				data: null,
				status: 403,
				success: false,
			};
		}
		return {
			data: `${session.user.username} <${session.user.email}>`,
			status: 200,
			success: true,
		};
	} catch (error) {
		return handleError(error);
	}
}
