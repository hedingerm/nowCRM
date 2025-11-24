import languages from "@/lib/static/iso639-languages.json";

const languagesByCode = new Map(languages.map((lang) => [lang.code, lang]));
const languagesByName = new Map(
	languages.map((lang) => [lang.name.toLowerCase(), lang]),
);
const languagesByNativeName = new Map(
	languages.map((lang) => [lang.nativeName.toLowerCase(), lang]),
);

/**
 * Normalizes a language value to ISO code.
 * Accepts ISO code ("de"), English name ("German"), or native name ("Deutsch").
 */
export function normalizeLanguageValue(value: any): string | null {
	if (!value || typeof value !== "string") return null;

	const normalized = value.trim().toLowerCase();

	// Try ISO code first (most common)
	if (languagesByCode.has(normalized)) {
		return languagesByCode.get(normalized)?.code || null;
	}

	// Try English name
	if (languagesByName.has(normalized)) {
		return languagesByName.get(normalized)?.code || null;
	}

	// Try native name
	if (languagesByNativeName.has(normalized)) {
		return languagesByNativeName.get(normalized)?.code || null;
	}

	// Try partial match on English name
	const matched = languages.find((l) =>
		l.name.toLowerCase().includes(normalized),
	);
	if (matched) return matched.code;

	// Try partial match on native name
	const matchedNative = languages.find((l) =>
		l.nativeName.toLowerCase().includes(normalized),
	);
	if (matchedNative) return matchedNative.code;

	return null;
}
