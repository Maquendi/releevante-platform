import {  sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { bookLoanSchema } from "./bookLoan";

const statuses = [
    "RETURNED_ON_TIME",
    "RETURNED_BEFORE_TIME",
    "RETURNED_OVERDUE",
    "CURRENT",
    "OVERDUE"
  ] as const
  
export const bookLoanStatusSchema = sqliteTable("book_loan_status", {
  id: text("id").primaryKey().notNull(),
  status:text('status',{enum:statuses}).notNull(),
  bookLoanId:text('book_load_id').notNull().references(()=>bookLoanSchema.id),
  created_at: text("created_at")
    .default(sql`(current_timestamp)`)
    .$defaultFn(() => new Date().toISOString()),
  updated_at: text("updated_at")
    .default(sql`(current_timestamp)`)
    .$defaultFn(() => new Date().toISOString())
    .$onUpdateFn(() => new Date().toISOString()),
});

export const bookLoanStatusSchemaRelations = relations(
    bookLoanStatusSchema,
    ({ one }) => ({
      bookLoan: one(bookLoanSchema, {
        fields: [bookLoanStatusSchema.bookLoanId],
        references: [bookLoanSchema.id],
      }),
    })
  );
  