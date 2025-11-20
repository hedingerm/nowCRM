"use server";

import { env } from "../config/env-config";

export async function getBaseLink(): Promise<string> {
	return env.CRM_BASE_URL;
}
