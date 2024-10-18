import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const books = sqliteTable('books',{
    id:integer('id').notNull(),
    name:text('name').notNull(),
    price:integer('price').notNull()
})