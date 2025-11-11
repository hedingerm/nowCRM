"use server";

import { auth } from "@/auth";
import { BaseServiceName, DocumentId } from "@nowcrm/services";
import { StrapiQuery } from "@nowcrm/services";
import { handleError, ServiceFactory, StandardResponse } from "@nowcrm/services/server";

//TODO: remove here any types

export async function findData(
	serviceName: BaseServiceName,
	options?: StrapiQuery<any>,
): Promise<StandardResponse<any[]>> {
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
		const response = await service.find(session?.jwt,options as any);
		return response;
	} catch (error) {
		return handleError(error);
	}
}

export async function findSingleData(
	serviceName: BaseServiceName,
	id: DocumentId,
	options?: StrapiQuery<any>,
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
		const response = await service.findOne(id, options as any);
		return response;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to fetch item");
	}
}
