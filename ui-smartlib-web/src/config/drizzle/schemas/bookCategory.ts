import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from "uuid";
import { relations } from "drizzle-orm";
import { bookSchema } from "./books";
import { categorySchema } from "./category";
export const bookCategorySchema = sqliteTable("book_category", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  bookIsbn: text("book_isbn").references(() => bookSchema.id).notNull(),
  categoryId: text("category_id").references(() => categorySchema.id).notNull(),
});

export const bookCategoryRelations = relations(
    bookCategorySchema,
  ({ one }) => ({
    book: one(bookSchema, {
      fields: [bookCategorySchema.bookIsbn],
      references: [bookSchema.id],
    }),
    category: one(categorySchema, {
      fields: [bookCategorySchema.categoryId],
      references: [categorySchema.id],
    }),
  })
);
