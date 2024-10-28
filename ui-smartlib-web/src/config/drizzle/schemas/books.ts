import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from 'uuid';
import { bookCopieSchema } from "./book_copies";
import { bookImageSchema } from "./book_images";

export const bookSchema = sqliteTable('books',{
    id: text('id').primaryKey().$defaultFn(() => uuidv4()),
    name:text('name').notNull(),
    price:integer('price').notNull(),
    author:text('author').notNull(),
    created_at: text('created_at')
    .notNull()
    .default(sql`(current_timestamp)`).$defaultFn(()=>new Date().toISOString()),
    updated_at: text('updated_at')
    .notNull()
    .default(sql`(current_timestamp)`).$defaultFn(()=>new Date().toISOString()).$onUpdateFn(()=>new Date().toISOString()),
})


export const book_relations = relations(bookSchema, ({ many }) => ({
    copies:many(bookCopieSchema),
    images:many(bookImageSchema),
}));