import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { bookLoanSchema } from "./bookLoan";
import { bookCopieSchema } from "./bookCopies";

export const loanItemSchema = sqliteTable("loan_items", {
  id: text("id").primaryKey().notNull(),
  loanId: text("loan_id")
    .notNull()
    .references(() => bookLoanSchema.id),
  isbn: text("isbn").notNull(),
  bookCopyId: text("book_copy_id")
    .notNull()
    .references(() => bookCopieSchema.id),
  created_at: text("created_at")
    .default(sql`(current_timestamp)`)
    .$defaultFn(() => new Date().toISOString()),
  updated_at: text("updated_at")
    .default(sql`(current_timestamp)`)
    .$defaultFn(() => new Date().toISOString())
    .$onUpdateFn(() => new Date().toISOString()),
});

export const LoanItemsSchemaRelations = relations(
  loanItemSchema,
  ({ one }) => ({
    loan: one(bookLoanSchema, {
      fields: [loanItemSchema.loanId],
      references: [bookLoanSchema.id],
    }),
    bookCopy: one(bookCopieSchema, {
      fields: [loanItemSchema.bookCopyId],
      references: [bookCopieSchema.id],
    }),
  })
);

export type LoanItemSchema = typeof loanItemSchema.$inferSelect;