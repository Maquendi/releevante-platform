import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from "uuid";
import { relations } from "drizzle-orm";
import { bookSchema } from "./books";
import { ftagsSchema } from "./ftags";
export const bookFtagSchema = sqliteTable("book_ftag", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  bookIsbn: text("book_isbn").references(() => bookSchema.isbn,{onDelete:'cascade'}).notNull(),
  ftagId: text("ftag_id").references(() => ftagsSchema.id,{onDelete:'cascade'}).notNull(),
});

export const bookFtagRelations = relations(
  bookFtagSchema,
  ({ one }) => ({
    book: one(bookSchema, {
      fields: [bookFtagSchema.bookIsbn],
      references: [bookSchema.isbn],
    }),
    tags: one(ftagsSchema, {
      fields: [bookFtagSchema.ftagId],
      references: [ftagsSchema.id],
    }),
  })
);
