import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { books } from "./books";
import { books_edition_schema } from "./book_edition";

export const books_images_schema = sqliteTable('books_images', {
    id:integer('id',{mode:'number'}).primaryKey({autoIncrement:true}).notNull(),
    url: text('url',{mode:'text'}).notNull(),
    book_id: text('book_id').notNull().references(()=>books.id), 
    edition_id: text('edition_id').notNull().references(()=>books_edition_schema.id),
    isSincronized:integer('isSincronized',{mode:'boolean'}).default(false)
});

export const book_images_Relations = relations(books_images_schema, ({ one }) => ({
    book: one(books, {
        fields: [books_images_schema.book_id],
        references: [books.id],
    }),
    edition: one(books_edition_schema, {
        fields: [books_images_schema.edition_id],
        references: [books_edition_schema.id],
    }),
}));