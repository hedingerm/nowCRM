// functions/helpers/sanitizeContacts.ts
import { relationFields } from "../helpers/relations";

const relationFieldSet = new Set<string>(Object.keys(relationFields));

export function sanitizeContacts(contacts: any[]): any[] {
	return contacts.map((c) => {
		const out: Record<string, any> = {};

		for (const [k, v] of Object.entries(c)) {
			if (relationFieldSet.has(k)) continue;
			if (v === null || v === undefined) continue;

			if (typeof v === "string") {
				const t = v.trim();
				if (t !== "") out[k] = t;
			} else if (typeof v === "number" || typeof v === "boolean") {
				out[k] = v;
			}
		}

		if (Object.keys(out).length === 0) {
			out._keep = true;
		}

		return out;
	});
}
