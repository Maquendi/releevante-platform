import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from 'uuid';
import { user } from "./user";

export const organization = sqliteTable('organization', {
    id: text('id').primaryKey().$defaultFn(() => uuidv4()),
    name: text('name').notNull()
});

export const organizationRelations = relations(organization, ({ many }) => ({
    users: many(user) 
}));
