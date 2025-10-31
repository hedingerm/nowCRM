import { aiModelKeys } from "static/ai-models";
import { LanguageKeys } from "static/languages";
import { CompositionStatusKeys } from "types/composition";


export interface createComposition {
	name: string;
	category?: string;
	language?: LanguageKeys;
	mainChannel: number;
	persona?: string;
	status?: CompositionStatusKeys;
	model: aiModelKeys;
	reference_prompt?: string;
	reference_result?: string;
	add_unsubscribe: boolean;
	composition_items?: {
		additional_prompt: string;
		channel: number;
	}[];
}
