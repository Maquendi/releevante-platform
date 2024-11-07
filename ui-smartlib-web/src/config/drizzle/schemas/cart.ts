import { relations, sql } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
  index,
  unique,
} from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from "uuid";
import { userSchema } from "./user";
import { bookEditionSchema } from "./bookEditions";

const cartStatusEnum = [
  "PENDING",
  "CHECKED_OUT",
  "CHECKING_OUT",
  "CHECKOUT_FAILED",
  "STALE",
] as const;
export type CartState = (typeof cartStatusEnum)[number];

export const cartSchema = sqliteTable("cart", {
  id: text("id").primaryKey().notNull(),
  user_id: text("user_id")
    .notNull()
    .references(() => userSchema.id),
  state: text("state", {
    enum: cartStatusEnum,
  })
    .default("PENDING")
    .notNull(),
  created_at: text("created_at")
    .default(sql`(current_timestamp)`)
    .$defaultFn(() => new Date().toISOString()),
  updated_at: text("updated_at")
    .default(sql`(current_timestamp)`)
    .$defaultFn(() => new Date().toISOString())
    .$onUpdateFn(() => new Date().toISOString()),
});

export const cartItemSchema = sqliteTable(
  "cart_item",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuidv4()),
    isbn: text("isbn")
      .notNull()
      .references(() => bookEditionSchema.id),
    qty: integer("qty").notNull(),
    cart_id: text("cart_id")
      .notNull()
      .references(() => cartSchema.id),
    created_at: text("created_at")
      .notNull()
      .default(sql`(current_timestamp)`)
      .$defaultFn(() => new Date().toISOString()),
  }
);

export type CartItemSchema = typeof cartItemSchema.$inferInsert;

export const cartSchemaRelations = relations(cartSchema, ({ many }) => ({
  items: many(cartItemSchema),
}));

export const cartItemRelations = relations(cartItemSchema, ({ one }) => ({
  cart: one(cartSchema, {
    fields: [cartItemSchema.cart_id],
    references: [cartSchema.id],
  }),
  bookEdition: one(bookEditionSchema, {
    fields: [cartItemSchema.isbn],
    references: [bookEditionSchema.id],
  }),
}));
