"use server";

import { env } from "@/lib/config/env-config";

export async function getCrmVersion(_locale = "en"): Promise<string> {
	return env.NT_STACK_VERSION;
}
