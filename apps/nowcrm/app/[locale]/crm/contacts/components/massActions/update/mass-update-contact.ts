"use server";

import type { Contact, DocumentId, StandardResponse } from "@nowcrm/services";
import {
	contactInterestsService,
	contactJobTitlesService,
	contactNotesService,
	contactRanksService,
	contactSalutationsService,
	contactsService,
	contactTitlesService,
	contactTypesService,
	departmentsService,
	industriesService,
	keywordsService,
	organizationsService,
	sourcesService,
	tagsService,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

// Map each relation field to its service
const relationServiceMap = {
	organization: organizationsService,
	contact_interests: contactInterestsService,
	department: departmentsService,
	keywords: keywordsService,
	job_title: contactJobTitlesService,
	ranks: contactRanksService,
	contact_types: contactTypesService,
	sources: sourcesService,
	contact_notes: contactNotesService,
	industry: industriesService,
	title: contactTitlesService,
	salutation: contactSalutationsService,
	tags: tagsService,
} as const;

export async function MassUpdateContactField(
	contactIds: DocumentId[],
	field: string,
	value: string,
): Promise<StandardResponse<Contact[]>> {
	const session = await auth();
	if (!session) {
		return { data: null, status: 403, success: false };
	}

	try {
		const isRelation = field in relationServiceMap;
		let processedValue: string | number | number[];

		if (isRelation) {
			const names = value
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean);

			const svc = (relationServiceMap as any)[field];

			const ids = await Promise.all(
				names.map(async (name) => {
					const found = await svc.find(
						{ filters: { name: { $eq: name } } },
						session.jwt,
					);
					if (found.success && found.data && found.data.length > 0) {
						return found.data[0].id;
					}

					const created = await svc.create({ name }, session.jwt);
					if (!created.success || !created.data) {
						throw new Error(
							`Failed to create "${field}" relation with name "${name}"`,
						);
					}
					return created.data.id;
				}),
			);

			processedValue = ids.length === 1 ? ids[0] : ids;
		} else {
			processedValue = value;
		}

		const updateData = { [field]: processedValue };

		const updatePromises = contactIds.map((cid) =>
			contactsService.update(cid, updateData, session.jwt),
		);
		const results = await Promise.allSettled(updatePromises);

		const successful = results
			.filter(
				(r): r is PromiseFulfilledResult<any> =>
					r.status === "fulfilled" && r.value.success,
			)
			.map((r) => r.value.data);

		const failedCount = results.length - successful.length;
		if (failedCount > 0) {
			console.warn(`${failedCount} contact updates failed`);
		}

		return { data: successful, status: 200, success: true };
	} catch (error) {
		console.error("Error in MassUpdateContactField:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}
