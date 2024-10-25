import {  sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from 'uuid';
import { relations } from "drizzle-orm";
import { books_images_schema } from "./book_images";

export const books_edition_schema = sqliteTable('books_edition',{
    id: text('id').primaryKey().$defaultFn(() => uuidv4()),
    name:text('name').notNull(),
})

export const books_edition_relations = relations(books_edition_schema, ({ many }) => ({
    images: many(books_images_schema) 
}));
