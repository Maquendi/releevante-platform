import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { loanItemSchema } from "./LoanItems";

const LoanItemStatusValues = [
  "REPORTED_LOST",
  "LOST",
  "RETURNED",
  "REPORTED_DAMAGE",
  "DAMAGED",
  "REPORTED_SOLD",
  "SOLD",
  "BORROWED",
] as const;

export const loanItemStatusSchema = sqliteTable("loan_item_status", {
  id: text("id").primaryKey().notNull(),
  itemId: text("item_id")
    .notNull()
    .references(() => loanItemSchema.id),
  status: text("status", { enum: LoanItemStatusValues }).notNull(),
  isSynced: integer("is_synced", { mode: "boolean" }).default(false),
  created_at: text("created_at")
    .default(sql`(current_timestamp)`)
    .$defaultFn(() => new Date().toISOString()),
});

export const LoanItemStatusSchemaRelations = relations(
  loanItemStatusSchema,
  ({ one }) => ({
    loanItem: one(loanItemSchema, {
      fields: [loanItemStatusSchema.itemId],
      references: [loanItemSchema.id],
    }),
  })
);

export type LoanItemStatusSchema = typeof loanItemStatusSchema.$inferSelect;
