import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { bookTransactionItemSchema } from "./bookTransactionItem";
import { bookTransactionStatusSchema } from "./bookTransactionStatus";

export const bookTransactionSchema = sqliteTable("book_transactions", {
  id: text("id").primaryKey().notNull(),
  clientId: text("client_id").notNull(),
  transactionType: text("transaction_type", {
    enum: ["RENT", "PURCHASE"],
  }).notNull(),
  extenalId: text("external_id").default(""),
  returnsAt: text("returns_at").default(""),
  createdAt: text("created_at")
    .default(sql`(current_timestamp)`)
    .$defaultFn(() => new Date().toISOString()),
});

export const bookTransactionSchemaRelations = relations(
  bookTransactionSchema,
  ({ many }) => ({
    transactionItems: many(bookTransactionItemSchema),
    statuses: many(bookTransactionStatusSchema),
  })
);

export type BookTransactionSchema = typeof bookTransactionSchema.$inferSelect;
