import { pgTable, serial, timestamp, varchar, text, index } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const consultations = pgTable(
	"consultations",
	{
		id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
		name: varchar("name", { length: 100 }).notNull(),
		phone: varchar("phone", { length: 20 }).notNull(),
		company: varchar("company", { length: 200 }),
		domain: varchar("domain", { length: 50 }),
		message: text("message"),
		status: varchar("status", { length: 20 }).notNull().default("pending"),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [
		index("consultations_status_idx").on(table.status),
		index("consultations_created_at_idx").on(table.created_at),
	]
);
