import type { BaseFormType, BaseType } from "./common/base-type";
import type { SearchHistoryType } from "./search-history-template";

export interface SearchHistory extends Omit<BaseType, "name"> {
	type: SearchHistoryType;
	filters: object | string;
	query: object | string;
}

export interface Form_SearchHistory extends Omit<BaseFormType, "name"> {
	type: SearchHistoryType;
	filters: object | string;
	query: object | string;
}
