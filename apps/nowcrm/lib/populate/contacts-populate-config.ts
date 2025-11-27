/**
 * Populate configuration for Contacts table
 * Maps visible columns to relation fields that need to be populated
 */

import type { PopulateMapping } from "./populate-builder";

/**
 * Populate mappings for contacts
 * Each mapping defines which column requires which relation to be populated
 */
export const CONTACTS_POPULATE_MAPPINGS: PopulateMapping[] = [
	{
		columnKey: "tags",
		relationField: "tags",
	},
	{
		columnKey: "industry",
		relationField: "industry",
	},
	{
		columnKey: "contact_types",
		relationField: "contact_types",
	},
	{
		columnKey: "title",
		relationField: "title",
	},
	{
		columnKey: "salutation",
		relationField: "salutation",
	},
	{
		columnKey: "job_title",
		relationField: "job_title",
	},
	{
		columnKey: "organization",
		relationField: "organization",
	},
	{
		columnKey: "department",
		relationField: "department",
	},
	{
		columnKey: "lists",
		relationField: "lists",
	},
	{
		columnKey: "keywords",
		relationField: "keywords",
	},
	{
		columnKey: "contact_interests",
		relationField: "contact_interests",
	},
	{
		columnKey: "journeys",
		relationField: "journeys",
	},
	{
		columnKey: "journey_steps",
		relationField: "journey_steps",
	},
	{
		columnKey: "survey_items",
		relationField: "survey_items",
	},
	{
		columnKey: "subscriptions",
		relationField: "subscriptions",
		nestedPopulate: {
			channel: true,
		},
	},
];

