import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const userSchema = sqliteTable("user", {
  id: text("id").primaryKey(),
  access_id: text('access_id').notNull(),
  credential: text("credential").notNull(),
  is_active: integer("is_active", { mode: "boolean" }).default(true).notNull(),
  expires_at: text("expires_at").notNull(),
  created_at: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`)
    .$defaultFn(() => new Date().toISOString())
    .$onUpdateFn(() => new Date().toISOString()),
  updated_at: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`)
    .$defaultFn(() => new Date().toISOString())
    .$onUpdateFn(() => new Date().toISOString()),
});
