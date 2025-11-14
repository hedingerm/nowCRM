import { makeValidator } from "envalid";

const isCI = process.env.NODE_ENV === "production";

export const NotEmptyStringValidator = makeValidator((x: string) => {
	if (x || isCI) return x;
	else throw new Error("Expected not empty string");
});
