import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from "uuid";
import { relations, sql } from "drizzle-orm";
import { bookSchema } from "./books";
import {userSchema} from './user'
export const bookRatingsSchema = sqliteTable("book_ratings", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  isbn: text("isbn").notNull().references(()=>bookSchema.id),
  clientId: text("client_id").notNull().references(()=>userSchema.id),
  rating: integer("rating").notNull(),
  createdAt: text("created_at")
  .notNull()
  .default(sql`(current_timestamp)`)
  .$defaultFn(() => new Date().toISOString()),
});

export const bookRatingSchemaRelations = relations(
    bookRatingsSchema,
  ({ one }) => ({
    book: one(bookSchema, {
      fields: [bookRatingsSchema.isbn],
      references: [bookSchema.id],
    }),
    user: one(userSchema, {
        fields: [bookRatingsSchema.clientId],
        references: [userSchema.id],
      }),
  })
);
