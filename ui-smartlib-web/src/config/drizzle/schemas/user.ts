import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import {  relations, sql } from "drizzle-orm";
import { v4 as uuidv4 } from 'uuid';
import { organization_schema } from "./organization";

export const user_schema = sqliteTable('user',{
    id:text('id').primaryKey().$defaultFn(()=>uuidv4()),
    pin:text('pin').notNull(),
    is_active:integer('is_active',{mode:'boolean'}).default(true).notNull(),
    organization_id:text('organization_id').notNull(),
    created_at: text('created_at')
    .notNull()
    .default(sql`(current_timestamp)`).$defaultFn(()=>new Date().toISOString()).$onUpdateFn(()=>new Date().toISOString()),
    updated_at: text('updated_at')
    .notNull()
    .default(sql`(current_timestamp)`).$defaultFn(()=>new Date().toISOString()).$onUpdateFn(()=>new Date().toISOString()),
})

export const userRelations = relations(user_schema,({one})=>({
    organization:one(organization_schema,{
        fields:[user_schema.organization_id],
        references:[organization_schema.id]
    })
}))