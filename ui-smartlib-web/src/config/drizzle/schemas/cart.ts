import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text, index } from "drizzle-orm/sqlite-core";
import { bookCopieSchema } from "./book_copies";
import { v4 as uuidv4 } from "uuid";

export const cartSchema = sqliteTable("cart", {
  id: text("id").primaryKey().notNull(),
  user_id: text("user_id").notNull(),
  state: integer("state").notNull(),
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
    id: text("cart_id")
      .primaryKey()
      .$defaultFn(() => uuidv4()),
    book_copy_id: text("book_copy_id")
      .notNull()
      .references(() => bookCopieSchema.id),
    qty: integer("qty").notNull(),
    cart_id: text("cart_id").notNull(),
    created_at: text("created_at")
      .notNull()
      .default(sql`(current_timestamp)`)
      .$defaultFn(() => new Date().toISOString()),
  },
  (table) => {
    return {
      cartIdx: index("cart_idx").on(table.cart_id),
    };
  }
);

export const cartSchemaRelations = relations(cartSchema, ({ many }) => ({
  items: many(cartItemSchema),
}));

export const cartItemRelations = relations(cartItemSchema, ({ one }) => ({
  cart: one(cartSchema, {
    fields: [cartItemSchema.cart_id],
    references: [cartSchema.id],
  }),
  bookCopy: one(bookCopieSchema, {
    fields: [cartItemSchema.book_copy_id],
    references: [bookCopieSchema.id],
  }),
}));
