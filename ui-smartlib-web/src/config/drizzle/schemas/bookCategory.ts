import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from "uuid";
import { relations } from "drizzle-orm";
import { bookSchema } from "./books";
import { categorySchema } from "./category";

export const bookCategorySchema = sqliteTable("book_category", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  book_isbn: text("book_isbn").references(() => bookSchema.isbn),
  category_id: text("category_id").references(() => categorySchema.id),
});

export const bookCategoriesRelations = relations(
  bookCategorySchema,
  ({ one }) => ({
    book: one(bookSchema, {
      fields: [bookCategorySchema.book_isbn],
      references: [bookSchema.isbn],
    }),
    category: one(categorySchema, {
      fields: [bookCategorySchema.category_id],
      references: [categorySchema.id],
    }),
  })
);
