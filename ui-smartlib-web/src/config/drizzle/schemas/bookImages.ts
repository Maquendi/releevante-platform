import { InferSelectModel, relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { bookSchema } from "./books";

export const bookImageSchema = sqliteTable("books_images", {
  id: text("id").primaryKey().notNull(),
  external_id: text("external_id").notNull(),
  url: text("url").notNull(),
  source_url: text("source_url").notNull(),
  book_isbn: text("book_isbn")
    .notNull()
    .references(() => bookSchema.id),
  isSincronized: integer("isSincronized", { mode: "boolean" }).default(false),
});

export const bookImageRelations = relations(bookImageSchema, ({ one }) => ({
  book: one(bookSchema, {
    fields: [bookImageSchema.book_isbn],
    references: [bookSchema.id],
  }),
}));

export type Book_images_schema = InferSelectModel<typeof bookImageSchema>;
