import { sql } from "drizzle-orm";
import { sqliteTable, text, numeric } from "drizzle-orm/sqlite-core";

export const librarySettingsSchema = sqliteTable("library_settings", {
  id: text("id").primaryKey(),
  max_books_per_loan: numeric(),
  book_price_discount_percentage: numeric(),
  book_price_surcharge_percentage: numeric(),
  bookPriceReductionThreshold: numeric(),
  book_price_reduction_rate_on_threshold_reached: numeric(),
  session_duration_minutes: numeric(),
  book_usage_count_before_enabling_sale: numeric(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`)
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`)
    .$defaultFn(() => new Date().toISOString())
    .$onUpdateFn(() => new Date().toISOString()),
});
