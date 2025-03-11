import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from "uuid";
import { relations, sql } from "drizzle-orm";
import { userSchema } from "./user";
export const serviceRatingsSchema = sqliteTable("service_ratings", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  clientId: text("client_id")
    .notNull()
    .references(() => userSchema.id),
  rating: integer("rating").notNull(),
  comment:text('comment'),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`)
    .$defaultFn(() => new Date().toISOString()),
});

export const serviceRatingSchemaRelations = relations(
  serviceRatingsSchema,
  ({ one }) => ({
    user: one(userSchema, {
      fields: [serviceRatingsSchema.clientId],
      references: [userSchema.id],
    }),
  })
);
