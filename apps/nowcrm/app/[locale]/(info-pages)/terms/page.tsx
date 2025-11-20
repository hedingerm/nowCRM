import type { Metadata } from "next";
import { TermsOfServiceDisplay } from "@/components/infoPages/terms-of-service-display";

export const metadata: Metadata = {
	title: "Terms of Use",
};

export default async function Page() {
	return (
		<div className="container mt-2">
			<TermsOfServiceDisplay />
		</div>
	);
}
