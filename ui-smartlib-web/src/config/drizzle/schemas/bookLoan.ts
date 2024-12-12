import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { loanItemSchema } from "./LoanItems";
import { loanStatusSchema } from "./LoanStatus";

export const bookLoanSchema = sqliteTable("book_loans", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id").notNull(),
  cartId: text("cart_id").notNull(),
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
  bookLoanSchema,
  ({ many }) => ({
    loanItems: many(loanItemSchema),
    statuses: many(loanStatusSchema),
  })
);

export type BookLoanSchema = typeof bookLoanSchema.$inferSelect;
