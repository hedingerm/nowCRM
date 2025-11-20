import type { DocumentId } from "../common/base-type";

export type jobProcessorJobData = {
	jobId: string;
	contactId: DocumentId;
	stepId: DocumentId;
	journeyId: DocumentId;
	channel: DocumentId;
	compositionId: DocumentId;
	ignoreSubscription?: boolean;
};
