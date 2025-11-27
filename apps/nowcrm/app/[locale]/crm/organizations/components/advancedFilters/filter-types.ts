// Organizations filter types and categories
import { BaseServiceName } from "@nowcrm/services";

export const FIELD_TYPES: Record<
	string,
	"text" | "number" | "date" | "relation" | "enum"
> = {
	// General Information
	name: "text",
	email: "text",
	url: "text",

	// Address Information
	address_line1: "text",
	contact_person: "text",
	location: "text",
	country: "text",
	zip: "number",
	canton: "text",

	// Social Media
	twitter_url: "text",
	facebook_url: "text",
	whatsapp_channel: "text",
	linkedin_url: "text",
	telegram_url: "text",
	telegram_channel: "text",
	instagram_url: "text",
	tiktok_url: "text",
	whatsapp_phone: "text",

	// Relations
	organization_type: "relation",
	industry: "relation",
	frequency: "relation",
	media_type: "relation",
	sources: "relation",

	// Other
	language: "enum",
	tag: "text",
	description: "text",
};

export const RELATION_META: Record<
	string,
	{
		serviceName: BaseServiceName;
		labelKey: string;
		filterKey?: string;
		filter?: string;
		deduplicateByLabel?: boolean;
	}
> = {
	organization_type: {
		serviceName: "organizationTypesService",
		labelKey: "AdvancedFilters.fields.organization_type",
	},
	industry: {
		serviceName: "industriesService",
		labelKey: "AdvancedFilters.fields.industry",
	},
	frequency: {
		serviceName: "frequenciesService",
		labelKey: "AdvancedFilters.fields.frequency",
	},
	media_type: {
		serviceName: "mediaTypesService",
		labelKey: "AdvancedFilters.fields.media_type",
	},
	sources: {
		serviceName: "sourcesService",
		labelKey: "AdvancedFilters.fields.sources",
	},
};

export const FILTER_CATEGORIES = {
	general: {
		label: "General Information",
		fields: ["name", "email", "url"],
	},
	address: {
		label: "Address Information",
		fields: [
			"address_line1",
			"contact_person",
			"location",
			"country",
			"zip",
			"canton",
		],
	},
	social: {
		label: "Social Media",
		fields: [
			"twitter_url",
			"facebook_url",
			"whatsapp_channel",
			"linkedin_url",
			"telegram_url",
			"telegram_channel",
			"instagram_url",
			"tiktok_url",
			"whatsapp_phone",
		],
	},
	organization: {
		label: "Organization Types and Industries",
		fields: ["organization_type", "industry"],
	},
	preferences: {
		label: "Preferences / Other",
		fields: ["frequency", "media_type", "language", "tag", "description", "sources"],
	},
};

