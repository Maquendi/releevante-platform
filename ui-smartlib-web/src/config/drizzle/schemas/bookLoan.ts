import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { LoanItemsSchema } from "./LoanItems";

const LoanStatusValues = [
  "RETURNED_ON_TIME",
  "RETURNED_BEFORE_TIME",
  "RETURNED_OVERDUE",
  "CURRENT",
  "OVERDUE",
] as const;

export const BookLoanSchema = sqliteTable("book_loan", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id").notNull(),
  cartId: text("cart_id").notNull(),
  status: text("status", { enum: LoanStatusValues })
    .notNull()
    .default("CURRENT"),
  returnsAt: text("returns_at").notNull(),
  isSincronized: integer("isSincronized", { mode: "boolean" }).default(false),
  created_at: text("created_at")
    .default(sql`(current_timestamp)`)
    .$defaultFn(() => new Date().toISOString()),
  updated_at: text("updated_at")
    .default(sql`(current_timestamp)`)
    .$defaultFn(() => new Date().toISOString())
    .$onUpdateFn(() => new Date().toISOString()),
});

export const BookLoanSchemaRelations = relations(
  BookLoanSchema,
  ({ many }) => ({
    loanItems: many(LoanItemsSchema),
  })
);
