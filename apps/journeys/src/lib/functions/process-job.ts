import type { DocumentId } from "@nowcrm/services";
import { composerService, contactsService } from "@nowcrm/services/server";
import { env } from "@/common/utils/env-config";
import { logger } from "@/server";
import { getContact } from "./helpers/get-contact";
import { getJourney } from "./helpers/get-jouney";
import { getJourneyStep } from "./helpers/get-journey-step";

export async function processJob(
	contactId: DocumentId,
	stepId: DocumentId,
	journeyId: DocumentId,
	ignoreSubscription?: boolean,
): Promise<void> {
	const contact = await getContact(contactId);
	if (!contact.responseObject) {
		throw new Error(contact.message);
	}
	const step = await getJourneyStep(stepId);
	if (!step.responseObject) {
		throw new Error(step.message);
	}
	if (!step.responseObject.channel?.name) {
		throw new Error("Channel is missing in step");
	}

	const journey = await getJourney(journeyId);
	if (!journey.responseObject) {
		throw new Error(journey.message);
	}

	logger.info(`contact: ${contact} step: ${step} journey: ${journey}`);
	let check: boolean | null = true;
	if (!ignoreSubscription) {
		check = (
			await contactsService.checkSubscription(
				env.JOURNEYS_STRAPI_API_TOKEN,
				contact.responseObject,
				step.responseObject.channel.name,
			)
		).data;
	}
	if (check) {
		await composerService.sendComposition({
			composition_id: step.responseObject.composition.documentId,
			channels: [step.responseObject.channel?.name.toLowerCase()],
			to: contact.responseObject.email,
			type: "contact",
			subject:
				step.responseObject.composition.subject ||
				step.responseObject.composition.name,
			from: step.responseObject.identity.name,
			ignoreSubscription,
		});
	} else {
		logger.warn(`contact: ${contactId} doesnt have active subscription`);
		throw new Error(
			`contact: ${contactId} doesnt have active subscription for ${step.responseObject.channel.name}`,
		);
	}
}
