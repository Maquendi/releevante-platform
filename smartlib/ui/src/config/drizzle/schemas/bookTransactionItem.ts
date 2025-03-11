import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { bookCopieSchema } from "./bookCopies";
import { bookTransactionSchema } from "./bookTransaction";

export const bookTransactionItemSchema = sqliteTable("book_transaction_items", {
  id: text("id").primaryKey().notNull(),
  isSynced: integer("is_synced", { mode: "boolean" }).default(false),
  transactionId: text("transaction_id")
    .notNull()
    .references(() => bookTransactionSchema.id),
  isbn: text("isbn").notNull(),
  bookCopyId: text("book_copy_id")
    .notNull()
    .references(() => bookCopieSchema.id),
  createdAt: text("created_at")
    .default(sql`(current_timestamp)`)
    .$defaultFn(() => new Date().toISOString()),
});

export const bookTransactionItemSchemaRelations = relations(
  bookTransactionItemSchema,
  ({ one }) => ({
    bookTransaction: one(bookTransactionSchema, {
      fields: [bookTransactionItemSchema.transactionId],
      references: [bookTransactionSchema.id],
    }),
    bookCopy: one(bookCopieSchema, {
      fields: [bookTransactionItemSchema.bookCopyId],
      references: [bookCopieSchema.id],
    }),
  })
);

export type BookTransactionItemSchema =
  typeof bookTransactionItemSchema.$inferSelect;
