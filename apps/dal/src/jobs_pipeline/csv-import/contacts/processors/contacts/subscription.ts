import { pool } from "../helpers/db";

//create channel
async function ensureChannelId(name: string): Promise<number> {
	const res = await pool.query("SELECT id FROM channels WHERE name = $1", [
		name,
	]);
	if (res.rows.length > 0) return res.rows[0].id;

	const insert = await pool.query(
		"INSERT INTO channels (name) VALUES ($1) RETURNING id",
		[name],
	);
	return insert.rows[0].id;
}

//check subscription without subscription type
export async function ensureEmailSubscription(
	contactId: number,
): Promise<void> {
	const client = await pool.connect();
	try {
		await client.query("BEGIN");

		const channelId = await ensureChannelId("Email");

		const existingSub = await client.query(
			`SELECT s.id
       FROM subscriptions s
       JOIN subscriptions_contact_lnk scl ON scl.subscription_id = s.id
       JOIN subscriptions_channel_lnk sch ON sch.subscription_id = s.id
       WHERE scl.contact_id = $1 AND sch.channel_id = $2 AND s.active = true
       LIMIT 1`,
			[contactId, channelId],
		);

		if (existingSub.rows.length > 0) {
			await client.query("COMMIT");
			return;
		}

		const now = new Date().toISOString();
		const { rows: subscriptionRows } = await client.query(
			`INSERT INTO subscriptions (subscribed_at, active, period, published_at)
       VALUES ($1, true, 1, $2)
       RETURNING id`,
			[now, now],
		);
		const subscriptionId = subscriptionRows[0].id;

		await client.query(
			`INSERT INTO subscriptions_contact_lnk (subscription_id, contact_id)
       VALUES ($1, $2)`,
			[subscriptionId, contactId],
		);

		await client.query(
			`INSERT INTO subscriptions_channel_lnk (subscription_id, channel_id)
       VALUES ($1, $2)`,
			[subscriptionId, channelId],
		);

		await client.query("COMMIT");
	} catch (error) {
		await client.query("ROLLBACK");
		console.error("Error in ensureEmailSubscription:", error);
		throw error;
	} finally {
		client.release();
	}
}
