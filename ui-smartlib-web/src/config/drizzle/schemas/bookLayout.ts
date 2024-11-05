import {  sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from 'uuid';
import { relations } from "drizzle-orm";
import { bookCopieSchema } from "./bookCopies";

export const bookLayoutSchema = sqliteTable('book_layout',{
    id: text('id').primaryKey().$defaultFn(() => uuidv4()),
    book_copy_id: text('book_copy_id'),
    name:text('compartment').notNull(),
})

export const bookLayoutSchemaRelations = relations(bookLayoutSchema, ({ one }) => ({
    book: one(bookCopieSchema, {
        fields: [bookLayoutSchema.book_copy_id],
        references: [bookCopieSchema.id],
      }),
}));