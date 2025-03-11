import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from "uuid";
import { cart_schema } from "./cart";
import { books_copies_schema } from "./book_copies";
import { order_schema } from "./order";

export const order_details_schema = sqliteTable("order_details", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  order_id: text("cart_id").references(() => order_schema.id),
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

export const order_details_relations = relations(order_details_schema, ({ one }) => ({
  copies: one(books_copies_schema, {
    fields: [order_details_schema.book_copy_id],
    references: [books_copies_schema.id],
  }),
  order: one(order_schema, {
    fields: [order_details_schema.order_id],
    references: [order_schema.id],
  }),
}));
