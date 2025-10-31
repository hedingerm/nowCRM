import { aiModelKeys } from "static/ai-models";
import { LanguageKeys } from "static/languages";

export interface ReferenceComposition {
	title?: string;
	language?: LanguageKeys;
	mainChannel?: number;
	category?: string;
	promptBase?: string;
	persona?: string;
	model: aiModelKeys;
	prompt: string;
}
