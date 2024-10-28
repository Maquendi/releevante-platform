import { InferSelectModel, relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { bookSchema } from "./books";
import { bookEditionSchema } from "./book_editions";

export const bookImageSchema = sqliteTable("books_images", {
  id: integer("id", { mode: "number" })
    .primaryKey({ autoIncrement: true })
    .notNull(),
  url: text("url", { mode: "text" }).notNull(),
  book_id: text("book_id").notNull(),
  edition_id: text("edition_id").notNull(),
  isSincronized: integer("isSincronized", { mode: "boolean" }).default(false),
});

export const bookImageRelations = relations(bookImageSchema, ({ one }) => ({
  book: one(bookSchema, {
    fields: [bookImageSchema.book_id],
    references: [bookSchema.id],
  }),
  edition: one(bookEditionSchema, {
    fields: [bookImageSchema.edition_id],
    references: [bookEditionSchema.id],
  }),
}));

export type Book_images_schema = InferSelectModel<typeof bookImageSchema>;
