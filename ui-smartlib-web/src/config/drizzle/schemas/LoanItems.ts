import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { BookLoanSchema } from "./bookLoan";
import { bookCopieSchema } from "./bookCopies";

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

export const LoanItemsSchema = sqliteTable("loan_items", {
  id: text("id").primaryKey().notNull(),
  loanId: text("load_id")
    .notNull()
    .references(() => BookLoanSchema.id),
  isbn: text("isbn").notNull(),
  bookCopyId: text("book_copy_id")
    .notNull()
    .references(() => bookCopieSchema.id),
  status: text("status", { enum: LoanItemStatusValues }).notNull(),
  created_at: text("created_at")
    .default(sql`(current_timestamp)`)
    .$defaultFn(() => new Date().toISOString()),
  updated_at: text("updated_at")
    .default(sql`(current_timestamp)`)
    .$defaultFn(() => new Date().toISOString())
    .$onUpdateFn(() => new Date().toISOString()),
});

export const LoanItemsSchemaRelations = relations(
  LoanItemsSchema,
  ({ one }) => ({
    book: one(BookLoanSchema, {
      fields: [LoanItemsSchema.loanId],
      references: [BookLoanSchema.id],
    }),
    bookPosition: one(bookCopieSchema, {
      fields: [LoanItemsSchema.bookCopyId],
      references: [bookCopieSchema.id],
    }),
  })
);
