import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { bookTransactionSchema } from "./bookTransaction";

export const bookTransactionStatusSchema = sqliteTable(
  "book_transaction_status",
  {
    id: text("id").primaryKey().notNull(),
    transactionId: text("transaction_id")
      .notNull()
      .references(() => bookTransactionSchema.id),
    status: text("status").notNull(),
    isSynced: integer("is_synced", { mode: "boolean" }).default(false),
    createdAt: text("created_at")
      .default(sql`(current_timestamp)`)
      .$defaultFn(() => new Date().toISOString()),
  }
);

export const bookTransactionStatusSchemaRelations = relations(
  bookTransactionStatusSchema,
  ({ one }) => ({
    bookTransaction: one(bookTransactionSchema, {
      fields: [bookTransactionStatusSchema.transactionId],
      references: [bookTransactionSchema.id],
    }),
  })
);

export type BookTransactionStatusSchema =
  typeof bookTransactionStatusSchema.$inferSelect;
