import {  sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from 'uuid';
import { relations } from "drizzle-orm";
import { bookCategorySchema } from "./bookCategory";

export const categorySchema = sqliteTable('category',{
    id: text('id').primaryKey().$defaultFn(() => uuidv4()),
    name: text('name').notNull(),
})

export const categorySchemaRelations = relations(categorySchema, ({ many }) => ({
    bookCategory: many(bookCategorySchema)
}));