import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { isNull, relations, sql } from "drizzle-orm";
import { bookTransactionItemSchema } from "./bookTransactionItem";
import { bookTransactionStatusSchema } from "./bookTransactionStatus";
import { TransactionType } from "@/core/domain/loan.model";

export const bookTransactionSchema = sqliteTable("book_transactions", {
  id: text("id").primaryKey().notNull(),
  extenalId: text("external_id"),
  clientId: text("client_id").notNull(),
  transactionType: text("transaction_type", {
    enum: [TransactionType.RENT, TransactionType.PURCHASE],
  }).notNull(),
  returnsAt: text("returns_at"),
  createdAt: text("created_at")
    .default(sql`(current_timestamp)`)
    .$defaultFn(() => new Date().toISOString()),
});

export const bookTransactionSchemaRelations = relations(
  bookTransactionSchema,
  ({ many }) => ({
    items: many(bookTransactionItemSchema),
    statuses: many(bookTransactionStatusSchema),
  })
);

export type BookTransactionSchema = typeof bookTransactionSchema.$inferSelect;
