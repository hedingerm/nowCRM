import { settingsService } from "@nowcrm/services/server";
import { auth } from "@/auth";
import ErrorMessage from "@/components/error-message";
import { env } from "@/lib/config/env-config";
import { ChannelSettingsForm } from "./components/channel-settings";
import { ChannelHealthCheck } from "./components/channelsHealthCheck/channels-health-check";

export default async function Page() {
	const session = await auth();
	const settings_item = await settingsService.find(session?.jwt, {
		populate: "*",
	});
	if (!settings_item.success || !settings_item.data || !settings_item.meta) {
		return <ErrorMessage response={settings_item} />;
	}

	return (
		<div>
			<ChannelHealthCheck settings={settings_item.data[0]} />
			<ChannelSettingsForm
				settings_id={settings_item.data[0].documentId}
				initialSubscription={settings_item.data[0].subscription || "ignore"}
				initialUnsubscribeText={settings_item.data[0].unsubscribe_text || ""}
				baseLink={env.CRM_BASE_URL}
			/>
		</div>
	);
}
