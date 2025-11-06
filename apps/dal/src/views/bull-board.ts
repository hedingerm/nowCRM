import { createBullBoard } from "@bull-board/api";
import { ExpressAdapter } from "@bull-board/express";
import { addToListQueue } from "@/lib/queues/add-to-list-queue";
import { addToOrganizationQueue } from "@/lib/queues/add-to-organization-queue";
import { anonymizeQueue } from "@/lib/queues/anonymize-queue";
import { csvMassActionsQueue } from "@/lib/queues/csv-mass-actions-queue";
import { deletionQueue } from "@/lib/queues/deletion-queue";
import { exportQueue } from "@/lib/queues/export-queue";
import { organizationsQueue } from "@/lib/queues/organizations-queue";
import { relationsQueue } from "@/lib/queues/relations-queue";
import { addToJourneyQueue } from "../lib/queues/add-to-journey-queue";
import { contactsQueue } from "../lib/queues/contacts-queue";
import { csvContactsQueue } from "../lib/queues/csv-contacts-queue";
import { csvOrganizationsQueue } from "../lib/queues/csv-organizations-queue";
import { orgRelationsQueue } from "../lib/queues/relations-queue-org";
import { updateQueue } from "../lib/queues/update-queue";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";

export const serverAdapter: ExpressAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

export const bullBoard = createBullBoard({
	queues: [new BullMQAdapter(csvContactsQueue),
		new BullMQAdapter(contactsQueue),
		new BullMQAdapter(csvOrganizationsQueue),
		new BullMQAdapter(organizationsQueue),
		new BullMQAdapter(csvMassActionsQueue),
		new BullMQAdapter(deletionQueue),
		new BullMQAdapter(addToListQueue),
		new BullMQAdapter(addToOrganizationQueue),
		new BullMQAdapter(addToJourneyQueue),
		new BullMQAdapter(relationsQueue),
		new BullMQAdapter(orgRelationsQueue),
		new BullMQAdapter(exportQueue),
		new BullMQAdapter(anonymizeQueue),
		new BullMQAdapter(updateQueue),],
	serverAdapter,
});
