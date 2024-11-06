import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from "uuid";
import { bookSchema } from "./books";
import { bookEditionSchema } from "./bookEditions";

export const bookCopieSchema = sqliteTable("books_copies", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  book_id: text("book_id")
    .notNull()
    .references(() => bookSchema.id),
  isbn: text("isbn")
    .notNull()
    .references(() => bookEditionSchema.id),
  is_available: integer("is_available", { mode: "boolean" })
    .notNull()
    .default(true),
  at_position: text("at_position").notNull(),
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
    fields: [bookCopieSchema.book_id],
    references: [bookSchema.id],
  }),

  bookEdition: one(bookEditionSchema, {
    fields: [bookCopieSchema.isbn],
    references: [bookEditionSchema.id],
  }),
}));

export type BookCopySchema = typeof bookCopieSchema.$inferSelect;
