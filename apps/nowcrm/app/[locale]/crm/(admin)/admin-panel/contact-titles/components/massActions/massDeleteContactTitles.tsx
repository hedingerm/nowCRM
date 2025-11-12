"use server";

import type { DocumentId } from "@nowcrm/services";
import { deleteContactTitleAction } from "@/lib/actions/contact-titles/delete-contact-title";

export async function MassDeleteContactTitles(contactTitleIds: DocumentId[]) {
	try {
		const deletePromises = contactTitleIds.map((id) =>
			deleteContactTitleAction(id),
		);
		await Promise.all(deletePromises);
		return { success: true };
	} catch (error) {
		console.error("Mass delete error:", error);
		return { success: false };
	}
}
