import { waitForStrapi } from "../functions/helpers/check-strapi";
import { startContactsWorkers } from "./contacts-worker";
import { startAddToJourneyWorker } from "./add-to-journey-worker";
import { startAddToListWorker } from "./add-to-list-worker";
import { startAddToOrganizationWorker } from "./add-to-organization-worker";
import { startAnonymizeWorker } from "./anonymize-worker";
import { startDeletionWorker } from "./deletion-worker";
import { startExportWorker } from "./export-worker";
import { startMassActionsWorker } from "./mass-actions-worker";
import { startOrganizationsWorkers } from "./organizations-worker";
import { startRelationsWorkers } from "./relation-worker";
import { startOrgRelationsWorkers } from "./relation-worker-org";
import { startUpdateSubscriptionWorker } from "./update-subscription-worker";
import { startUpdateWorker } from "./update-worker";

(async () => {
	try {
		console.log(" Checking if Strapi is ready...");
		await waitForStrapi();
		console.log(" Starting workers...");
		startContactsWorkers();
		startOrganizationsWorkers();
		startDeletionWorker();
		startAddToListWorker();
		startMassActionsWorker();
		startAddToOrganizationWorker();
		startAddToJourneyWorker();
		startRelationsWorkers();
		startAnonymizeWorker();
		startExportWorker();
		startUpdateWorker();
		startUpdateSubscriptionWorker();
		startOrgRelationsWorkers();
	} catch (err) {
		console.error(" Failed to start workers:", err);
		process.exit(1);
	}
})();
