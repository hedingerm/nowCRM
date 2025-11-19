import qs from "qs";
import { env } from "@/common/utils/env-config";

export async function resolveDocumentId(entity: string, documentId: string) {
	if (!documentId) {
		throw new Error("resolveDocumentId: empty documentId");
	}

	const query = qs.stringify(
		{
			filters: { documentId: { $eq: documentId } },
			publicationState: "live",
		},
		{ encodeValuesOnly: true },
	);

	const url = `${env.STRAPI_URL}${entity}?${query}`;

	const res = await fetch(url, {
		headers: { Authorization: `Bearer ${env.DAL_STRAPI_API_TOKEN}` },
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(`resolveDocumentId failed HTTP ${res.status}: ${text}`);
	}

	const json = await res.json();
	const entry = json?.data?.[0];

	if (!entry) {
		throw new Error(
			`resolveDocumentId: entity ${entity} not found for documentId ${documentId}`,
		);
	}

	return entry.id;
}
