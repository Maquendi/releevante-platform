import { sql } from "drizzle-orm";
import { sqliteTable, text, numeric } from "drizzle-orm/sqlite-core";

export const librarySettingsSchema = sqliteTable("library_settings", {
  id: text("id").primaryKey(),
  maxBooksPerLoan: numeric("max_books_per_loan").notNull(),
  bookPriceDiscountPercentage: numeric(
    "book_price_discount_percentage"
  ).notNull(),
  bookPriceSurchargePercentage: numeric(
    "book_price_surcharge_percentage"
  ).notNull(),
  bookPriceReductionThreshold: numeric(
    "book_price_reduction_threshold"
  ).notNull(),
  bookPriceReductionRateOnThresholdReached: numeric(
    "book_price_reduction_rate_on_threshold_reached"
  ).notNull(),
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
