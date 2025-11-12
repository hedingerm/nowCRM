// actions/deleteContactAction.ts
"use server";
import type { DocumentId, Form_TextBlock, TextBlock } from "@nowcrm/services";
import {
	handleError,
	type StandardResponse,
	textblocksService,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function updateTextBlock(
	id: DocumentId,
	values: Partial<Form_TextBlock>,
): Promise<StandardResponse<TextBlock>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await textblocksService.update(id, values, session.jwt);
		return res;
	} catch (error) {
		return handleError(error);
	}
}
