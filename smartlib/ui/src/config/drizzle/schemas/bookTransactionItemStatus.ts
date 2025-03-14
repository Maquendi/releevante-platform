import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { bookTransactionItemSchema } from "./bookTransactionItem";

export const bookTransactionItemStatusSchema = sqliteTable(
  "book_transaction_item_status",
  {
    id: text("id").primaryKey().notNull(),
    itemId: text("item_id")
      .notNull()
      .references(() => bookTransactionItemSchema.id),
    status: text("status").notNull(),
    isSynced: integer("is_synced", { mode: "boolean" }).default(false),
    created_at: text("created_at")
      .default(sql`(current_timestamp)`)
      .$defaultFn(() => new Date().toISOString()),
  },
  (t) => ({
    uniqueTransactionItemStatus: unique().on(t.itemId, t.status),
  })
);

export const bookTransactionItemStatusSchemaRelations = relations(
  bookTransactionItemStatusSchema,
  ({ one }) => ({
    transactionItem: one(bookTransactionItemSchema, {
      fields: [bookTransactionItemStatusSchema.itemId],
      references: [bookTransactionItemSchema.id],
    }),
  })
);

export type BookTransactionItemStatusSchema =
  typeof bookTransactionItemStatusSchema.$inferSelect;
