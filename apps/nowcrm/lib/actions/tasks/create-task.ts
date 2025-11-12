// actions/deleteContactAction.ts
"use server";
import type { Form_Task, Task } from "@nowcrm/services";
import {
	handleError,
	type StandardResponse,
	tasksService,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function createTask(
	values: Partial<Form_Task>,
): Promise<StandardResponse<Task>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await tasksService.create(values, session.jwt);
		return res;
	} catch (error) {
		return handleError(error);
	}
}
