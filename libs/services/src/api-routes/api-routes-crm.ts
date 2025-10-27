const APIRoutes = {
	// Authentication & User Profile
	AUTH_LOGIN: "/api/auth/login",
	AUTH_REDIRECT: "/",
	FORGOT_PASSWORD: "auth/forgot-password",
	REGISTER: "auth/local/register",
	RESET_PASSWORD: "auth/reset-password",
	STRAPI_AUTH_LOGIN: "connect/auth0",
	STRAPI_AUTH_CALLBACK: "auth/auth0/callback",
	PROFILE_PAGE: "/user/profile",

	// Contacts
	CONTACTS: "contacts",
	CONTACT_FIND_ALL: "contacts/find-all",
	CONTACT_EXPORT_DATA: "contacts/export-user-data",
	CONTACT_ANONYMIZE_DATA: "contacts/anonymize-user",
	CONTACTS_SAFE_CREATE: "contacts/safeCreate",
	CONTACT_INTERESTS: "contact-interests",
	CONTACT_TYPES: "contact-types",
	CONTACT_EXTRA_FIELDS: "contact-extra-fields",

	// Donations
	DONATION_TRANSACTIONS: "donation-transactions",
	DONATION_SUBSCRIPTIONS: "donation-subscriptions",

	// Organizations & Departments
	ORGANIZATIONS: "organizations",
	ORGANIZATIONS_DUPLICATE: "organization/duplicate",
	DEPARTMENTS: "departments",
	ORGANIZATION_TYPES: "organization-types",

	// Forms & Surveys
	FORMS: "forms",
	FORMS_DUPLICATE: "forms/duplicate",
	FORM_ITEMS: "form-items",
	FORM_SUBMIT: "forms/form-submit",
	SURVEYS: "surveys",
	SURVEY_ITEMS: "survey-items",

	// Lists
	LISTS: "lists",
	LISTS_COUNT_CONTACTS: "active-contacts-count",
	LISTS_DUPLICATE: "lists/duplicate",
	LIST_PUSH_TO_PINPOINT: "lists/push-to-pinpoint",
	TAGS: "tags",

	// Journeys
	JOURNEYS: "journeys",
	JOURNEY_STEPS: "journey-steps",
	JOURNEYS_DUPLICATE: "journeys/duplicate",
	JOURNEY_STEP_CONNECTIONS: "journey-step-connections",
	JOURNEYS_STEP_RULE_SCORE: "journey-step-rule-scores",
	JOURNEY_PASSED_STEPS: "journey-passed-steps",
	JOURNEY_STEP_RULES: "journey-rules",

	// Events & Tracking
	EVENTS: "events",
	EVENTS_COMPOSITION_CHANNEL_CHART_DATA: "chart/get-composition-channel-data",
	EVENTS_TRACK: "events/track",
	CHART_EVENT_ACTIONTYPE_DATA: "chart/get-event",

	// Actions & Scoring
	ACTIONS: "actions",
	ACTION_TYPES: "action-normalized-types",
	SCORE_ITEM: "score-items",
	SCORE_CONTACT_AGG: "score-items/contact-aggregations",
	SCORE_RANGE: "score-ranges",

	// Compositions & Messaging
	COMPOSITIONS: "compositions",
	SCHEDULED_COMPOSITIONS: "scheduled-compositions",
	COMPOSITIONS_ITEMS: "composition-items",
	COMPOSITIONS_SCHEDULED: "compositions-scheduled",
	COMPOSITION_CREATE_NEW: "composition-news/create-composition",
	COMPOSITION_TO_CHANNEL_NEW: "composition-news/push-to-channel",
	COMPOSITION_TO_CHANNEL: "compositions/push-to-channel",
	COMPOSITION_CREATE_REFERENCE: "compositions/create-reference",
	COMPOSITION_CREATE_COMPOSITION: "compositions/create-composition",
	COMPOSITION_TEMPLATE: "composition-templates",
	COMPOSITION_TEMPLATE_GROUP: "composition-template-groups",
	MESSAGES: "messages",
	QRCODE: "compositions/qrcode",
	COMPOSITION_DUPLICATE: "organization/duplicate",

	// Settings & Configuration
	SETTINGS: "settings",
	SETTING_CREDENTIALS: "setting-credentials",
	CHANNELS: "channels",
	KEYWORDS: "keywords",
	RANKS: "ranks",
	SOURCES: "sources",
	FREQUENCIES: "frequencies",
	MEDIA_TYPES: "media-types",
	EMAIL_TEMPLATES: "email-templates",
	SUBSCRIBE_CONFIRMATIONS: "subscribe-confirmations",
	INDUSTRY: "industries",
	CONSENTS: "consents",
	TERMS: "terms",
	CRM_VERSION: "get-crm-version",

	// Subscriptions
	SUBSCRIPTIONS: "subscriptions",
	SUBSCRIPTION_TYPES: "subscription-types",
	SUBSCRIPTION_CREATE_CONTACT: "subscription/create-contact",
	SUBSCRIPTION_UNSUBSCRIBE: "subscription/unsubscribe",

	DAL: {
		QUEUE_DATA: "queue-data",
		PROGRESS: "import-progress",
		UPLOAD: "upload-csv",
		MASS_DELETE: "mass-actions/delete",
		MASS_ADD_TO_LIST: "mass-actions/add-to-list",
	},

	// Uploads
	UPLOAD: "upload",
	UPLOAD_FILES: "upload/files",
	CSV_IMPORT: "csv-import",

	// Content & Notes
	TEXTBLOCKS: "text-blocks",
	NOTES: "notes",

	// Notifications & Logs
	NOTIFICATIONS: "notifications",
	ACTIVITY_LOGS: "activity-logs",

	// Tasks
	TASKS: "tasks",

	// Documents
	DOCUMENT_LN_NAVIGATOR: "documents/create-ln-navigator",
	DOCUMENT_LN_CERTIFICATE: "documents/create-ln-certificate",
	DOCUMENTS: "documents",

	// Video Ask Options
	VIDEO_ASK_OPTIONS: "video-ask-options",

	// Search & Templates
	SEARCH_HISTORY: "search-histories",
	SEARCH_HISTORY_TEMPLATES: "search-history-templates",

	// Embeddable Reports
	EMBEDDABLE_REPORTS: "embeddable-reports",

	// Users & Identities
	USERS: "users",
	IDENTITY: "identities",
	UNIPILE_IDENTITY: "unipile-identities",
};
export default APIRoutes;
