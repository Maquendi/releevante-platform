import { relations, sql } from "drizzle-orm";
import {  sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from 'uuid';
import { bookCopieSchema } from "./bookCopies";
import { bookImageSchema } from "./bookImages";
import { bookCategorySchema } from "./bookCategory";

export const bookSchema = sqliteTable('books',{
    isbn: text('isbn').primaryKey().$defaultFn(() => uuidv4()),
    book_title:text('book_title').notNull(),
    edition_title:text('edition_title').notNull(),
    author:text('author').notNull(),
    created_at: text('created_at')
    .notNull()
    .default(sql`(current_timestamp)`).$defaultFn(()=>new Date().toISOString()),
    updated_at: text('updated_at')
    .notNull()
    .default(sql`(current_timestamp)`).$defaultFn(()=>new Date().toISOString()).$onUpdateFn(()=>new Date().toISOString()),
})


export const book_relations = relations(bookSchema, ({ many}) => ({
    copies:many(bookCopieSchema),
    images:many(bookImageSchema),
    categories:many(bookCategorySchema),
}));