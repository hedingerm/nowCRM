"use server";
import type { DocumentId } from "@nowcrm/services";
import {
	type BaseServiceName,
	handleError,
	ServiceFactory,
} from "@nowcrm/services/server";
import { auth } from "@/auth";
export async function DeleteData(serviceName: BaseServiceName, id: DocumentId) {
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
		const response = await service.delete(id, session.jwt);
		return response;
	} catch (error) {
		return handleError(error);
	}
}
