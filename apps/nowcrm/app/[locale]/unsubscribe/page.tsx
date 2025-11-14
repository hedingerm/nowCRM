// contactsapp/app/[locale]/unsubscribe/page.tsx

import type { DocumentId } from "@nowcrm/services";
import type { Metadata } from "next";
import UnsubscribeComponent from "./components/unsubscribe";

export const metadata: Metadata = {
	title: "Unsubscribe from nowCRM",
};

export default async function Page(props: {
	searchParams: Promise<{
		email: string;
		channel?: string;
		composition_id?: DocumentId;
	}>;
}) {
	const searchParams = await props.searchParams;

	return (
		<UnsubscribeComponent
			email={searchParams.email}
			channel={searchParams.channel || "Email"}
			compositionId={
				searchParams.composition_id ? searchParams.composition_id : undefined
			}
		/>
	);
}
