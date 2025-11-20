"use client";

import type { CommunicationChannel } from "@nowcrm/services";
import dynamic from "next/dynamic";
import type React from "react";
import type { ComponentType } from "react";

import type { EmailChannelContentProps } from "./send-to-channels/content/email-channel-content";
import type { LinkedinInvitesChannelContentProps } from "./send-to-channels/content/linkedin-invitations-channel-content";
import type { SMSChannelContentProps } from "./send-to-channels/content/sms-channel-content";
import type { WhatsAppChannelContentProps } from "./send-to-channels/content/whatsapp-channel-content";

const EmailChannelContent = dynamic<EmailChannelContentProps>(
	() =>
		import("./send-to-channels/content/email-channel-content").then(
			(mod) => mod.EmailChannelContent,
		),
	{ ssr: false },
);

const SmsChannelContent = dynamic<SMSChannelContentProps>(
	() =>
		import("./send-to-channels/content/sms-channel-content").then(
			(mod) => mod.SMSChannelContent,
		),
	{ ssr: false },
);

const WhatsappChannelContent = dynamic<WhatsAppChannelContentProps>(
	() =>
		import("./send-to-channels/content/whatsapp-channel-content").then(
			(mod) => mod.WhatsAppChannelContent,
		),
	{ ssr: false },
);

const LinkedInInvitationsChannelContent =
	dynamic<LinkedinInvitesChannelContentProps>(
		() =>
			import(
				"./send-to-channels/content/linkedin-invitations-channel-content"
			).then((mod) => mod.LinkedinInvitesChannelContent),
		{ ssr: false },
	);

const channelMap: Partial<
	Record<Lowercase<CommunicationChannel>, ComponentType<any>>
> = {
	email: EmailChannelContent as any,
	sms: SmsChannelContent as any,
	whatsapp: WhatsappChannelContent as any,
	linkedin_invitations: LinkedInInvitationsChannelContent as any,
};

interface ChannelContentProps {
	channel: Lowercase<CommunicationChannel>;
	mode: "composer" | "mass_actions";
	contacts?: string;
	setSelectedOption?: (opt: any) => void;
	closeOnSubmit?: () => void;
}

export const ChannelContent: React.FC<ChannelContentProps> = ({
	channel,
	mode,
	contacts,
	setSelectedOption,
	closeOnSubmit,
}) => {
	const Component = channelMap[channel];
	if (!Component) {
		return <p>Channel «{channel}» not supported.</p>;
	}
	return (
		<Component
			mode={mode}
			contacts={contacts}
			setSelectedOption={setSelectedOption}
			closeOnSubmit={closeOnSubmit}
		/>
	);
};
