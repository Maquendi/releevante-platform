import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from 'uuid';
import { user_schema } from "./user";

export const organization_schema = sqliteTable('organization', {
    id: text('id').primaryKey().$defaultFn(() => uuidv4()),
    name: text('name').notNull()
});

export const organization_relations = relations(organization_schema, ({ many }) => ({
    users: many(user_schema) 
}));
