import type { DocumentId } from "../common/base-type";

export type ruleProcessorJobData = {
	jobId: string;
	contactId: DocumentId;
	stepId: DocumentId;
};
