import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, numeric, integer } from "drizzle-orm/sqlite-core";
import { bookCopieSchema } from "./bookCopies";
import { bookImageSchema } from "./bookImages";
import { bookFtagSchema } from "./bookFtags";

export const bookSchema = sqliteTable("books", {
  id: text("id").primaryKey(),
  bookTitle: text("book_title").notNull(),
  correlationId: text("correlation_id").notNull(),
  editionTitle: text("edition_title").notNull(),
  language: text("language").notNull(),
  author: text("author").notNull(),
  descriptionEn: text("description_en").notNull(),
  descriptionFr: text("description_fr").notNull(),
  descriptionEs: text("description_es").notNull(),
  printLength: integer("print_length").notNull(),
  publicationDate: text("publicationDate").notNull(),
  dimensions: text("dimensions").notNull(),
  price: numeric(),
  publicIsbn: text("public_isbn").default(""),
  publisher: text("publisher").notNull(),
  bindingType: text("binding_type").notNull(),
  image: text("image").notNull(),
  imageId: text("image_id").notNull(),
  translationId: text("translation_id").notNull(),
  qty: integer("qty").notNull().default(0),
  qty_for_sale: integer("qty_for_sale")
    .notNull()
    .default(0),
  rating: numeric(),
  votes: numeric(),
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
