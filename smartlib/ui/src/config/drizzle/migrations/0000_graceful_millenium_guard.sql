CREATE TABLE `books_copies` (
	`id` text PRIMARY KEY NOT NULL,
	`book_isbn` text NOT NULL,
	`status` text NOT NULL,
	`is_available` integer DEFAULT true,
	`at_position` text NOT NULL,
	`usage_count` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`book_isbn`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `book_ftag` (
	`id` text PRIMARY KEY NOT NULL,
	`book_isbn` text NOT NULL,
	`ftag_id` text NOT NULL,
	FOREIGN KEY (`book_isbn`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`ftag_id`) REFERENCES `ftags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `books_images` (
	`id` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`source_url` text NOT NULL,
	`book_isbn` text NOT NULL,
	`isSincronized` integer DEFAULT false,
	FOREIGN KEY (`book_isbn`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `book_layout` (
	`id` text PRIMARY KEY NOT NULL,
	`book_copy_id` text,
	`compartment` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `book_ratings` (
	`id` text PRIMARY KEY NOT NULL,
	`isbn` text NOT NULL,
	`client_id` text NOT NULL,
	`rating` integer NOT NULL,
	`comment` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`isbn`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`client_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `books` (
	`id` text PRIMARY KEY NOT NULL,
	`book_title` text NOT NULL,
	`correlation_id` text NOT NULL,
	`edition_title` text NOT NULL,
	`language` text NOT NULL,
	`author` text NOT NULL,
	`description_en` text NOT NULL,
	`description_fr` text NOT NULL,
	`description_es` text NOT NULL,
	`print_length` integer NOT NULL,
	`publicationDate` text NOT NULL,
	`dimensions` text NOT NULL,
	`price` numeric,
	`public_isbn` text DEFAULT '',
	`publisher` text NOT NULL,
	`binding_type` text NOT NULL,
	`image` text NOT NULL,
	`image_id` text NOT NULL,
	`translation_id` text NOT NULL,
	`qty` integer DEFAULT 0 NOT NULL,
	`qty_for_sale` integer DEFAULT 0 NOT NULL,
	`rating` numeric,
	`votes` numeric,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `book_transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`client_id` text NOT NULL,
	`transaction_type` text NOT NULL,
	`external_id` text DEFAULT '',
	`returns_at` text DEFAULT '',
	`created_at` text DEFAULT (current_timestamp)
);
--> statement-breakpoint
CREATE TABLE `book_transaction_items` (
	`id` text PRIMARY KEY NOT NULL,
	`transaction_id` text NOT NULL,
	`isbn` text NOT NULL,
	`book_copy_id` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp),
	FOREIGN KEY (`transaction_id`) REFERENCES `book_transactions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`book_copy_id`) REFERENCES `books_copies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `book_transaction_item_status` (
	`id` text PRIMARY KEY NOT NULL,
	`item_id` text NOT NULL,
	`status` text NOT NULL,
	`is_synced` integer DEFAULT false,
	`created_at` text DEFAULT (current_timestamp),
	FOREIGN KEY (`item_id`) REFERENCES `book_transaction_items`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `book_transaction_status` (
	`id` text PRIMARY KEY NOT NULL,
	`transaction_id` text NOT NULL,
	`status` text NOT NULL,
	`is_synced` integer DEFAULT false,
	`created_at` text DEFAULT (current_timestamp),
	FOREIGN KEY (`transaction_id`) REFERENCES `book_transactions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `cart_item` (
	`id` text PRIMARY KEY NOT NULL,
	`isbn` text NOT NULL,
	`qty` integer NOT NULL,
	`cart_id` text NOT NULL,
	`transaction_type` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`isbn`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`cart_id`) REFERENCES `cart`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `cart` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`state` text DEFAULT 'PENDING' NOT NULL,
	`created_at` text DEFAULT (current_timestamp),
	`updated_at` text DEFAULT (current_timestamp),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ftags` (
	`id` text PRIMARY KEY NOT NULL,
	`tag_name` text NOT NULL,
	`en_tag_value` text NOT NULL,
	`fr_tag_value` text NOT NULL,
	`es_tag_value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`access_id` text NOT NULL,
	`credential` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `library_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`max_books_per_loan` numeric NOT NULL,
	`book_price_discount_percentage` numeric NOT NULL,
	`book_price_surcharge_percentage` numeric NOT NULL,
	`book_price_reduction_threshold` numeric NOT NULL,
	`session_duration_minutes` numeric NOT NULL,
	`book_usage_count_before_enabling_sale` numeric NOT NULL,
	`book_price_reduction_rate_on_threshold_reached` numeric NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `service_ratings` (
	`id` text PRIMARY KEY NOT NULL,
	`client_id` text NOT NULL,
	`rating` integer NOT NULL,
	`comment` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`client_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
