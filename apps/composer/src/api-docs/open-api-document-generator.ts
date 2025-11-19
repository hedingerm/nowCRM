import {
	OpenAPIRegistry,
	OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { composerRegistry } from "@/api/composer/composer-router";
import { snsWebhookRegistry } from "@/api/ses-events/sns-webhook-router";

export function generateOpenAPIDocument() {
	const registry = new OpenAPIRegistry([composerRegistry, snsWebhookRegistry]);

	const generator = new OpenApiGeneratorV3(registry.definitions);

	return generator.generateDocument({
		openapi: "3.0.0",
		info: {
			version: "1.0.0",
			title: "Swagger API",
		},
		externalDocs: {
			description: "View the raw OpenAPI Specification in JSON format",
			url: "/swagger.json",
		},
	});
}
