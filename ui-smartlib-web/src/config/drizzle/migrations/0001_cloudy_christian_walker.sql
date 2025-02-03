PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_library_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`max_books_per_loan` numeric,
	`book_price_discount_percentage` numeric,
	`book_price_surcharge_percentage` numeric,
	`bookPriceReductionThreshold` numeric,
	`book_price_reduction_rate_on_threshold_reached` numeric,
	`session_duration_minutes` numeric,
	`book_usage_count_before_enabling_sale` numeric,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_library_settings`("id", "max_books_per_loan", "book_price_discount_percentage", "book_price_surcharge_percentage", "bookPriceReductionThreshold", "book_price_reduction_rate_on_threshold_reached", "session_duration_minutes", "book_usage_count_before_enabling_sale", "created_at", "updated_at") SELECT "id", "max_books_per_loan", "book_price_discount_percentage", "book_price_surcharge_percentage", "bookPriceReductionThreshold", "book_price_reduction_rate_on_threshold_reached", "session_duration_minutes", "book_usage_count_before_enabling_sale", "created_at", "updated_at" FROM `library_settings`;--> statement-breakpoint
DROP TABLE `library_settings`;--> statement-breakpoint
ALTER TABLE `__new_library_settings` RENAME TO `library_settings`;--> statement-breakpoint
PRAGMA foreign_keys=ON;