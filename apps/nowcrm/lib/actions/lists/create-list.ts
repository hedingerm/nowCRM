// actions/deleteContactAction.ts
"use server";
import type { DocumentId, List } from "@nowcrm/services";
import {
	handleError,
	listsService,
	type StandardResponse,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function createList(
	name: string,
	contactIds?: DocumentId[],
): Promise<StandardResponse<List>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const createData: {
			name: string;
			contacts?: { connect: DocumentId[] };
			publishedAt: Date;
		} = {
			name: name,
			publishedAt: new Date(),
		};

		if (contactIds && contactIds.length > 0) {
			createData.contacts = { connect: contactIds };
		}

		const res = await listsService.create(createData, session.jwt);
		return res;
	} catch (error) {
		return handleError(error);
	}
}
