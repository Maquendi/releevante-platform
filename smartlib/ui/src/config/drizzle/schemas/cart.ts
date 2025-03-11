import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from "uuid";
import { userSchema } from "./user";
import { bookSchema } from "./books";

export const cartSchema = sqliteTable("cart", {
  id: text("id").primaryKey().notNull(),
  user_id: text("user_id")
    .notNull()
    .references(() => userSchema.id),
  state: text("state").default("PENDING").notNull(),
  created_at: text("created_at")
    .default(sql`(current_timestamp)`)
    .$defaultFn(() => new Date().toISOString()),
  updated_at: text("updated_at")
    .default(sql`(current_timestamp)`)
    .$defaultFn(() => new Date().toISOString())
    .$onUpdateFn(() => new Date().toISOString()),
});

export const cartItemSchema = sqliteTable("cart_item", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  isbn: text("isbn")
    .notNull()
    .references(() => bookSchema.id),
  qty: integer("qty").notNull(),
  cartId: text("cart_id")
    .notNull()
    .references(() => cartSchema.id),
  transactionType: text("transaction_type", {
    enum: ["RENT", "PURCHASE"],
  }).notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`)
    .$defaultFn(() => new Date().toISOString()),
});

export const cartSchemaRelations = relations(cartSchema, ({ many }) => ({
  items: many(cartItemSchema),
}));

export const cartItemRelations = relations(cartItemSchema, ({ one }) => ({
  cart: one(cartSchema, {
    fields: [cartItemSchema.cartId],
    references: [cartSchema.id],
  }),
  book: one(bookSchema, {
    fields: [cartItemSchema.isbn],
    references: [bookSchema.id],
  }),
}));
