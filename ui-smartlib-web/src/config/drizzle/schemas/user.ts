import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const user = sqliteTable('user',{
    id:integer('id').notNull(),
    name:text('name').notNull()
})