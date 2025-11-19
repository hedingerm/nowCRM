export function checkDocumentId(identifier: string | string[] | undefined) {
	if (Array.isArray(identifier)) {
		return identifier.every(checkDocumentId);
	}
	if (!identifier) return false;
	if (typeof identifier !== "string") return false;
	return /^[a-zA-Z0-9]{24}$/.test(identifier);
}
