import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from "uuid";
import { cart_schema } from "./cart";
import { books_copies_schema } from "./book_copies";

export const cart_details_schema = sqliteTable("cart_details", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  cart_id: text("cart_id",{mode:'text'}).references(() => cart_schema.id),
  quantity: integer("quantity").notNull(),
  book_copy_id: text("book_copy_id").references(() => cart_schema.id),
  created_at: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`)
    .$defaultFn(() => new Date().toISOString())
    .$onUpdateFn(() => new Date().toISOString()),
  updated_at: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`)
    .$defaultFn(() => new Date().toISOString())
    .$onUpdateFn(() => new Date().toISOString()),
});

export const cart_details_relations = relations(cart_details_schema, ({ one }) => ({
  copies: one(books_copies_schema, {
    fields: [cart_details_schema.book_copy_id],
    references: [books_copies_schema.id],
  }),
  cart: one(cart_schema, {
    fields: [cart_details_schema.cart_id],
    references: [cart_schema.id],
  }),
}));


export type InsertCartDetails = typeof cart_details_schema.$inferInsert;
export type SelectCartDetails = typeof cart_details_schema.$inferSelect;

