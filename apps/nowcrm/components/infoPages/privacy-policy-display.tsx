"use client";

import type { DocumentId } from "@nowcrm/services";
import { useParams } from "next/navigation";
import { InfoMarkdownDisplay } from "@/components/infoPages/info-markdown-display";
import { getLatestConsents } from "@/lib/actions/consent/get-latest-consents";

type PrivacyPolicyDisplayProps = {
	id?: DocumentId;
};
export function PrivacyPolicyDisplay({ id }: PrivacyPolicyDisplayProps) {
	const params = useParams();
	const locale = params?.locale as string;
	return (
		<InfoMarkdownDisplay
			title="Privacy Policy"
			fetchContent={() => getLatestConsents(locale, id)}
			errorMessage="Failed to load privacy policy. Please try again later."
		/>
	);
}
