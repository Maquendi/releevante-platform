import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { loanItemSchema } from "./LoanItems";
import { loanStatusSchema } from "./LoanStatus";

export const bookLoanSchema = sqliteTable("book_loans", {
  id: text("id").primaryKey().notNull(),
  extenalId: text("external_id").default(""),
  clientId: text("client_id").notNull(),
  returnsAt: text("returns_at").notNull(),
  createdAt: text("created_at")
    .default(sql`(current_timestamp)`)
    .$defaultFn(() => new Date().toISOString()),
});

export const BookLoanSchemaRelations = relations(
  bookLoanSchema,
  ({ many }) => ({
    loanItems: many(loanItemSchema),
    statuses: many(loanStatusSchema),
  })
);

export type BookLoanSchema = typeof bookLoanSchema.$inferSelect;
