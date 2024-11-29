import {  sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from 'uuid';
import { relations } from "drizzle-orm";
import { bookCategorySchema } from "./bookCategory";


export const categorySchema = sqliteTable('category',{
    id: text('id').primaryKey().$defaultFn(() => uuidv4()),
    enName:text('en_name').notNull().unique(),
    frName:text('fr_name').notNull().unique(),
    esName:text('es_name').notNull().unique(),
})

export const categorySchemaRelations = relations(categorySchema, ({ many }) => ({
    bookCategory: many(bookCategorySchema)
}));