import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from 'uuid';
import { books } from "./books";


export const books_copies_schema = sqliteTable('books_copies',{
    id: text('id').primaryKey().$defaultFn(() => uuidv4()),
    book_id:text('book_id').notNull().references(()=>books.id),
    edition_id:text('edition_name').notNull(),
    is_available:integer('is_available',{mode:'boolean'}).notNull().default(true),
    created_at: text('created_at')
    .notNull()
    .default(sql`(current_timestamp)`).$defaultFn(()=>new Date().toISOString()).$onUpdateFn(()=>new Date().toISOString()),
    updated_at: text('updated_at')
    .notNull()
    .default(sql`(current_timestamp)`).$defaultFn(()=>new Date().toISOString()).$onUpdateFn(()=>new Date().toISOString()),
})

export const book_copies_Relations = relations(books_copies_schema, ({ one }) => ({
    book: one(books, {
        fields: [books_copies_schema.book_id],
        references: [books.id],
    })
}));