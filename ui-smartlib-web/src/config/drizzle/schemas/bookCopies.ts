import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from "uuid";
import { bookSchema } from "./books";
import { bookLayoutSchema } from "./bookLayout";

export const bookCopieSchema = sqliteTable("books_copies", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  book_isbn: text("book_isbn")
    .notNull()
    .references(() => bookSchema.isbn),
  is_available: integer("is_available", { mode: "boolean" })
    .notNull()
    .default(true),
  at_position: text("at_position")
    .notNull(),
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

export const bookCopieRelations = relations(bookCopieSchema, ({ one }) => ({
  book: one(bookSchema, {
    fields: [bookCopieSchema.book_isbn],
    references: [bookSchema.isbn],
  }),
  bookPosition: one(bookLayoutSchema, {
    fields: [bookCopieSchema.at_position],
    references: [bookLayoutSchema.id],
  }),
}));

export type BookCopySchema = typeof bookCopieSchema.$inferSelect;
