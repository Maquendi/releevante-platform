import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, numeric } from "drizzle-orm/sqlite-core";
import { bookCopieSchema } from "./bookCopies";
import { bookImageSchema } from "./bookImages";
import { bookFtagSchema } from "./bookFtags";

export const bookSchema = sqliteTable("books", {
  id: text("id").primaryKey(),
  correlationId: text("correlation_id").notNull(),
  bookTitle: text("book_title").notNull(),
  editionTitle: text("edition_title").notNull(),
  author: text("author").notNull(),
  enDescription: text("en_description").notNull(),
  frDescription: text("fr_description").notNull(),
  esDescription: text("es_description").notNull(),
  price: numeric(),
  printLength: text("print_length").notNull(),
  dimensions: text("dimensions").notNull(),
  language: text("languaje")
    .notNull(),
  publisher: text("publisher").notNull(),
  publicationDate:text("publication_date"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`)
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`)
    .$defaultFn(() => new Date().toISOString())
    .$onUpdateFn(() => new Date().toISOString()),
});

export const book_relations = relations(bookSchema, ({ many }) => ({
  copies: many(bookCopieSchema),
  images: many(bookImageSchema),
  tags: many(bookFtagSchema),
}));
