"use server";

import type { DocumentId } from "@nowcrm/services";
import {
	type BaseServiceName,
	handleError,
	ServiceFactory,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function removeTag(
	serviceName: BaseServiceName,
	entityId: DocumentId,
	tagId: DocumentId,
) {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}

	try {
		const service = ServiceFactory.getService(serviceName);
		const res = await service.update(
			entityId,
			{
				tags: { disconnect: [tagId] },
			},
			session.jwt,
		);
		return res;
	} catch (error) {
		return handleError(error);
	}
}
