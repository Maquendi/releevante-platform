import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from "uuid";
import { relations } from "drizzle-orm";
import { bookFtagSchema } from "./bookFtags";
import { ftagsEnum } from "@/book/domain/models";


export const ftagsSchema = sqliteTable("ftags", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  tagName: text("tag_name", {
    enum:ftagsEnum
  }).notNull(),
  enTagValue: text("en_tag_value").notNull().unique(),
  frTagValue: text("fr_tag_value").notNull().unique(),
  esTagValue: text("es_tag_value").notNull().unique(),
});

export const bookLayoutSchemaRelations = relations(ftagsSchema, ({ many }) => ({
  bookTags: many(bookFtagSchema),
}));
