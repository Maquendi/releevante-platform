import { relations, sql } from "drizzle-orm";
import {  sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from 'uuid';
import { bookCopieSchema } from "./bookCopies";
import { bookImageSchema } from "./bookImages";
import { bookFtagSchema } from "./bookFtags";

export const bookSchema = sqliteTable('books',{
    id: text('id').primaryKey().$defaultFn(() => uuidv4()),
    bookTitle:text('book_title').notNull(),
    editionTitle:text('edition_title').notNull(),
    author:text('author').notNull(),
    createdAt: text('created_at')
    .notNull()
    .default(sql`(current_timestamp)`).$defaultFn(()=>new Date().toISOString()),
    updatedAt: text('updated_at')
    .notNull()
    .default(sql`(current_timestamp)`).$defaultFn(()=>new Date().toISOString()).$onUpdateFn(()=>new Date().toISOString()),
})


export const book_relations = relations(bookSchema, ({ many}) => ({
    copies:many(bookCopieSchema),
    images:many(bookImageSchema),
    tags:many(bookFtagSchema),
}));