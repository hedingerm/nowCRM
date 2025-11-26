"use client";
import {
	DATE_OPERATORS,
	NUMBER_OPERATORS,
	type Operator,
	TEXT_OPERATORS,
} from "@nowcrm/services";

export function getOperatorsForField(
	field: string,
	fieldTypes: Record<string, "text" | "number" | "date" | "relation" | "enum">,
): Operator[] {
	const type = fieldTypes[field] || "text";
	if (type === "number") return NUMBER_OPERATORS;
	if (type === "date") return DATE_OPERATORS;
	return TEXT_OPERATORS;
}
