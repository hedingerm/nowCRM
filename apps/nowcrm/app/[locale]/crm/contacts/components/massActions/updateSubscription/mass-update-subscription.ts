// actions/update.ts
"use server";

import type {
	DocumentId,
	Form_Subscription,
	StandardResponse,
	StrapiQuery,
	Subscription,
} from "@nowcrm/services";
import { handleError, subscriptionsService } from "@nowcrm/services/server";
import { auth } from "@/auth";

export async function MassUpdateSubscription(
	contactIds: DocumentId[],
	channelId: DocumentId,
	isSubscribe: boolean,
): Promise<StandardResponse<Subscription[]>> {
	const session = await auth();
	if (!session) {
		return { data: null, status: 403, success: false };
	}

	try {
		const ops = contactIds.map(async (contactId) => {
			const options: StrapiQuery<Subscription> = {
				filters: {
					channel: { documentId: { $eq: channelId } },
					contact: { documentId: { $eq: contactId } },
				},
			};

			const findRes = await subscriptionsService.find(session.jwt, options);
			if (!findRes.success) {
				throw new Error(`Can't find subscription for contact=${contactId}`);
			}

			const existing = findRes.data?.[0] ?? null;

			if (existing) {
				if (isSubscribe) {
					if (!existing.active) {
						const updateRes = await subscriptionsService.update(
							existing.documentId,
							{ active: true, subscribed_at: new Date() },
							session.jwt,
						);
						if (!updateRes.success || !updateRes.data) {
							throw new Error(
								`Can't activate subscription id=${existing.documentId}`,
							);
						}
						return updateRes.data;
					}
				} else {
					if (existing.active) {
						const updateRes = await subscriptionsService.update(
							existing.documentId,
							{ active: false },
							session.jwt,
						);
						if (!updateRes.success || !updateRes.data) {
							throw new Error(
								`Can't deactivate subscription id=${existing.documentId}`,
							);
						}
						return updateRes.data;
					}
				}
				return existing;
			}

			if (isSubscribe) {
				const createRes = await subscriptionsService.create(
					{
						channel: channelId,
						contact: contactId,
						subscribed_at: new Date(),
						active: true,
					} as Form_Subscription,
					session.jwt,
				);
				if (!createRes.success || !createRes.data) {
					throw new Error(`Can't create subscription for contact=${contactId}`);
				}
				return createRes.data;
			}

			return null;
		});

		const results = (await Promise.all(ops)).filter(
			(x): x is Subscription => x !== null,
		);

		return { data: results, status: 200, success: true };
	} catch (error: any) {
		return handleError(error);
	}
}
