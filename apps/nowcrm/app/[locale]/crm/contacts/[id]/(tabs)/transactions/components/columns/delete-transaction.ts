// actions/deleteContactAction.ts
"use server";

import type { DocumentId } from "@nowcrm/services";
import {
	donationTransactionsService,
	handleError,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";
export async function deleteTransactionAction(
	transaction: DocumentId,
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
		const response = await donationTransactionsService.delete(
			transaction,
			session.jwt,
		);
		return response;
	} catch (error) {
		return handleError(error);
	}
}
