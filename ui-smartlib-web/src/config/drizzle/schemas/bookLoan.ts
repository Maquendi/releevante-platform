import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

const LoanStatusEnum = ["onschedule", "late"] as const;

export const bookLoanSchema = sqliteTable("book_loan", {
  id: text("id").primaryKey().notNull(),
  user_id: text("user_id").notNull(),
  cart_id: text("cart_id").notNull(),
  total_items: integer("total_items").notNull(),
  status: text("status", {
    enum: LoanStatusEnum,
  })
    .default("onschedule")
    .notNull(),
  start_time: text("start_time")
    .default(sql`(current_timestamp)`)
    .$defaultFn(() => new Date().toISOString()),
  end_time: text("end_time"),
  created_at: text("created_at")
    .default(sql`(current_timestamp)`)
    .$defaultFn(() => new Date().toISOString()),
  updated_at: text("updated_at")
    .default(sql`(current_timestamp)`)
    .$defaultFn(() => new Date().toISOString())
    .$onUpdateFn(() => new Date().toISOString()),
});

export interface BookLoanDetail {
  id: string;
  isbn: string;
  book_copy_id: string;
  itemPrice: number;
}

export const bookLoanDetailSchema = sqliteTable("book_loan_detail", {
  id: text("id").primaryKey().notNull(),
  isbn: text("isbn").notNull(),
  book_copy_id: text("book_copy_id").notNull(),
  book_loan_id: text("book_loan_id").references(() => bookLoanSchema.id),
});
