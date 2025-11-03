import { createBullBoard } from "@bull-board/api";
import { ExpressAdapter } from "@bull-board/express";
import { massSendQueue, sendQueue } from "@/lib/queues/SendQueue";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";

export const serverAdapter: ExpressAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

export const bullBoard = createBullBoard({
	queues: [new BullMQAdapter(sendQueue), new BullMQAdapter(massSendQueue)],
	serverAdapter,
});
