import type { BaseFormType, BaseType, DocumentId } from "./common/base-type";
import type { FormEntity } from "./form";

export type FormEntityItemType =
	| "text"
	| "email"
	| "number"
	| "text_area"
	| "checkbox"
	| "radio"
	| "select"
	| "date"
	| "single_choice"
	| "multi_choice"
	| "attachment"
	| "multi_checkbox";

export interface FormEntityItem extends BaseType {
	form: FormEntity;
	type: FormEntityItemType;
	label: string;
	options: object | any;
	rank: number;
	required: boolean;
	hidden: boolean;
}

export interface Form_FormEntityItem extends BaseFormType {
	form: DocumentId;
	type: FormEntityItemType;
	label: string;
	options: object;
	rank: number;
	required: boolean;
	hidden: boolean;
}
