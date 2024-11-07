import { relations, sql } from "drizzle-orm";
import {  sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from 'uuid';
import { bookCopieSchema } from "./bookCopies";
import { bookImageSchema } from "./bookImages";
import { bookCategorySchema } from "./bookCategory";
import { bookEditionSchema } from "./bookEditions";

export const bookSchema = sqliteTable('books',{
    id: text('id').primaryKey().$defaultFn(() => uuidv4()),
    name:text('name').notNull(),
    isbn:text('isbn').references(()=>bookEditionSchema.id),
    author:text('author').notNull(),
    created_at: text('created_at')
    .notNull()
    .default(sql`(current_timestamp)`).$defaultFn(()=>new Date().toISOString()),
    updated_at: text('updated_at')
    .notNull()
    .default(sql`(current_timestamp)`).$defaultFn(()=>new Date().toISOString()).$onUpdateFn(()=>new Date().toISOString()),
})


export const book_relations = relations(bookSchema, ({ many,one}) => ({
    copies:many(bookCopieSchema),
    images:many(bookImageSchema),
    categories:many(bookCategorySchema),
    edition:one(bookEditionSchema,{
        fields:[bookSchema.isbn],
        references:[bookEditionSchema.id]
    })
}));