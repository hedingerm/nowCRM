// actions/deleteContactAction.ts
"use server";

import type { Contact, DocumentId, StandardResponse } from "@nowcrm/services";
import {
	contactsService,
	handleError,
	journeyStepsService,
	journeysService,
} from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function removeFromStepContact(
	contactId: DocumentId,
	stepId: DocumentId,
): Promise<StandardResponse<Contact>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}

	try {
		// 1. Remove contact from the step
		const response = await contactsService.update(
			contactId,
			{
				journey_steps: { disconnect: [stepId] },
			},
			session.jwt,
		);

		// 2. Fetch the step to get its journey
		const step = await journeyStepsService.findOne(stepId, session.jwt, {
			populate: {
				journey: {
					populate: {
						journey_steps: {
							populate: {
								contacts: true,
							},
						},
					},
				},
			},
		});

		const journey = step?.data?.journey;
		if (!journey?.id) {
			return response; // no journey found, return
		}

		// 3. Check if contact exists in other steps of the same journey
		const contactStillInOtherSteps = journey.journey_steps.some((step: any) =>
			step.contacts.some(
				(contact: Contact) => contact.documentId === contactId,
			),
		);

		if (!contactStillInOtherSteps) {
			// 4. Remove from journey as well
			await journeysService.update(
				journey.documentId,
				{
					contacts: { disconnect: [contactId] },
				},
				session.jwt,
			);
		}

		return response;
	} catch (error) {
		return handleError(error);
	}
}
