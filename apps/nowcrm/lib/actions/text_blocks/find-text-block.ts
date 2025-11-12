"use server";
import type { StrapiQuery, TextBlock } from "@nowcrm/services";
import { textblocksService } from "@nowcrm/services/server";
import { auth } from "@/auth";
export async function findTextBlock(
	query: StrapiQuery<TextBlock>,
): Promise<string[]> {
	const session = await auth();
	if (!session) return [];

	try {
		const textBlocks = await textblocksService.find(
			session.jwt,
			query,
			session.jwt,
		);
		return textBlocks.data
			? textBlocks.data.map((item) => {
					return `text_block.${item.name.replaceAll(" ", "-")}`;
				})
			: [];
	} catch (error) {
		console.error("Error getting subscription:", error);
		return [];
	}
}
