import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { bookLoanSchema } from "./bookLoan";

const LoanStatusValues = [
  "RETURNED_ON_TIME",
  "RETURNED_BEFORE_TIME",
  "RETURNED_OVERDUE",
  "CURRENT",
  "OVERDUE",
  "PENDING",
  "CHECKING_OUT",
] as const;

export const loanStatusSchema = sqliteTable("loan_status", {
  id: text("id").primaryKey().notNull(),
  loanId: text("loan_id")
    .notNull()
    .references(() => bookLoanSchema.id),
  status: text("status", { enum: LoanStatusValues }).notNull(),
  isSynced: integer("is_synced", { mode: "boolean" }).default(false),
  createdAt: text("created_at")
    .default(sql`(current_timestamp)`)
    .$defaultFn(() => new Date().toISOString()),
});

export const LoanItemStatusSchemaRelations = relations(
  loanStatusSchema,
  ({ one }) => ({
    loanItem: one(bookLoanSchema, {
      fields: [loanStatusSchema.loanId],
      references: [bookLoanSchema.id],
    }),
  })
);

export type LoanStatusSchema = typeof loanStatusSchema.$inferSelect;
