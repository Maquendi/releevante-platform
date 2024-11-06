import { InferSelectModel, relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { bookSchema } from "./books";
import { bookEditionSchema } from "./bookEditions";

export const bookImageSchema = sqliteTable("books_images", {
  id: integer("id", { mode: "number" })
    .primaryKey({ autoIncrement: true })
    .notNull(),
  url: text("url", { mode: "text" }).notNull(),
  book_id: text("book_id").notNull(),
  isbn: text("isbn").notNull(),
  isSincronized: integer("isSincronized", { mode: "boolean" }).default(false),
});

export const bookImageRelations = relations(bookImageSchema, ({ one }) => ({
  book: one(bookSchema, {
    fields: [bookImageSchema.book_id],
    references: [bookSchema.id],
  }),
  edition: one(bookEditionSchema, {
    fields: [bookImageSchema.isbn],
    references: [bookEditionSchema.id],
  }),
}));

export type Book_images_schema = InferSelectModel<typeof bookImageSchema>;
