import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const userSchema = sqliteTable("user", {
  id: text("id").primaryKey(),
  accessId: text("access_id").notNull(),
  credential: text("credential"),
  contactless: text("contact_less"),
  isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
  expiresAt: text("expires_at").notNull(),
});
