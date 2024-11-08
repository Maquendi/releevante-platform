import { InferSelectModel, relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { bookSchema } from "./books";

export const bookImageSchema = sqliteTable("books_images", {
  id: integer("id", { mode: "number" })
    .primaryKey({ autoIncrement: true })
    .notNull(),
  url: text("url", { mode: "text" }).notNull(),
  book_isbn: text("book_isbn").notNull().references(()=>bookSchema.isbn),
  isSincronized: integer("isSincronized", { mode: "boolean" }).default(false),
});

export const bookImageRelations = relations(bookImageSchema, ({ one }) => ({
  book: one(bookSchema, {
    fields: [bookImageSchema.book_isbn],
    references: [bookSchema.isbn],
  }),
}));

export type Book_images_schema = InferSelectModel<typeof bookImageSchema>;
