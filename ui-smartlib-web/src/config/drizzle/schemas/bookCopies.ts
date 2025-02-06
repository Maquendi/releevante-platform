import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { bookSchema } from "./books";
import { bookLayoutSchema } from "./bookLayout";
import { bookTransactionItemSchema } from "./bookTransactionItem";

export const bookCopieSchema = sqliteTable("books_copies", {
  id: text("id").primaryKey(),
  book_isbn: text("book_isbn")
    .notNull()
    .references(() => bookSchema.id),
  is_available: integer("is_available", { mode: "boolean" })
    .notNull()
    .default(true),
  at_position: text("at_position").default("M10"),
  usageCount: integer("usage_count", { mode: "number" }).notNull().default(0),
  created_at: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`)
    .$defaultFn(() => new Date().toISOString()),
  updated_at: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`)
    .$defaultFn(() => new Date().toISOString())
    .$onUpdateFn(() => new Date().toISOString()),
});

export const bookCopieRelations = relations(
  bookCopieSchema,
  ({ one, many }) => ({
    book: one(bookSchema, {
      fields: [bookCopieSchema.book_isbn],
      references: [bookSchema.id],
    }),
    bookPosition: one(bookLayoutSchema, {
      fields: [bookCopieSchema.at_position],
      references: [bookLayoutSchema.id],
    }),
    loanItems: many(bookTransactionItemSchema),
  })
);

export type BookCopySchema = typeof bookCopieSchema.$inferSelect;
