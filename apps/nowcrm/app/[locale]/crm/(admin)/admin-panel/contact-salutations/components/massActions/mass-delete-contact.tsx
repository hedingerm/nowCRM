"use server";

import type { DocumentId } from "@nowcrm/services";
import { deleteContactSalutationAction } from "@/lib/actions/contact-salutations/delete-contact-salutation";

export async function MassDeleteContactSalutations(
	contactSalutationIds: DocumentId[],
) {
	try {
		const deletePromises = contactSalutationIds.map((id) =>
			deleteContactSalutationAction(id),
		);
		await Promise.all(deletePromises);
		return { success: true };
	} catch (error) {
		console.error("Mass delete error:", error);
		return { success: false };
	}
}
