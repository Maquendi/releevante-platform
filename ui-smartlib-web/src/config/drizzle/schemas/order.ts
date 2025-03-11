import { relations } from "drizzle-orm";
import {  sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from 'uuid';
import { user_schema } from "./user";
import { order_details_schema } from "./order_details";

export const order_schema = sqliteTable('order',{
    id: text('id').primaryKey().$defaultFn(() => uuidv4()),
    userId:text('id').primaryKey().$defaultFn(()=>uuidv4()),
    status:text('status',{enum:['compleated','canceled']}).default('compleated').notNull(),
})


export const order_relations = relations(order_schema, ({ many,one }) => ({
   user:one(user_schema,{
    fields:[order_schema.userId],
    references:[user_schema.id]
   }),
   order:many(order_details_schema)
}));
