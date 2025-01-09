import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { bookSchema } from "./books";
import { bookLayoutSchema } from "./bookLayout";
import { loanItemSchema } from "./LoanItems";

export const bookCopieSchema = sqliteTable("books_copies", {
  id: text("id").primaryKey(),
  book_isbn: text("book_isbn")
    .notNull()
    .references(() => bookSchema.id),
  is_available: integer("is_available", { mode: "boolean" })
    .notNull()
    .default(true),
  at_position: text("at_position").default("M10"),
  condition:text('condition',{enum:['USED','NEW']}).notNull(),
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
    loanItems: many(loanItemSchema),
  })
);

export type BookCopySchema = typeof bookCopieSchema.$inferSelect;
