import type { Metadata } from "next";
import { PrivacyPolicyDisplay } from "@/components/infoPages/privacy-policy-display";

export const metadata: Metadata = {
	title: "Privacy Policy",
};

export default async function Page() {
	return (
		<div className="container mt-2">
			<PrivacyPolicyDisplay />
		</div>
	);
}
