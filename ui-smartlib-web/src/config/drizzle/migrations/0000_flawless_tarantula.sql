CREATE TABLE `book_category` (
	`id` text PRIMARY KEY NOT NULL,
	`book_isbn` text NOT NULL,
	`category_id` text NOT NULL,
	FOREIGN KEY (`book_isbn`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `books_copies` (
	`id` text PRIMARY KEY NOT NULL,
	`book_isbn` text NOT NULL,
	`is_available` integer DEFAULT true NOT NULL,
	`at_position` text NOT NULL,
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
	`external_id` text NOT NULL,
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
CREATE TABLE `book_loan_detail` (
	`id` text PRIMARY KEY NOT NULL,
	`isbn` text NOT NULL,
	`book_copy_id` text NOT NULL,
	`book_loan_id` text,
	FOREIGN KEY (`book_loan_id`) REFERENCES `book_loan`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `book_loan` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`cart_id` text NOT NULL,
	`total_items` integer NOT NULL,
	`external_id` text NOT NULL,
	`status` text DEFAULT 'onschedule' NOT NULL,
	`start_time` text DEFAULT (current_timestamp),
	`end_time` text,
	`created_at` text DEFAULT (current_timestamp),
	`updated_at` text DEFAULT (current_timestamp)
);
--> statement-breakpoint
CREATE TABLE `book_loan_status` (
	`id` text PRIMARY KEY NOT NULL,
	`status` text NOT NULL,
	`book_load_id` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp),
	`updated_at` text DEFAULT (current_timestamp),
	FOREIGN KEY (`book_load_id`) REFERENCES `book_loan`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `book_ratings` (
	`id` text PRIMARY KEY NOT NULL,
	`isbn` text NOT NULL,
	`client_id` text NOT NULL,
	`rating` integer NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`isbn`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`client_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `books` (
	`id` text PRIMARY KEY NOT NULL,
	`correlation_id` text NOT NULL,
	`book_title` text NOT NULL,
	`edition_title` text NOT NULL,
	`author` text NOT NULL,
	`en_description` text NOT NULL,
	`fr_description` text NOT NULL,
	`es_description` text NOT NULL,
	`price` numeric,
	`print_length` text NOT NULL,
	`dimensions` text NOT NULL,
	`languaje` text NOT NULL,
	`publisher` text NOT NULL,
	`publication_date` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
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
CREATE TABLE `category` (
	`id` text PRIMARY KEY NOT NULL,
	`en_name` text NOT NULL,
	`fr_name` text NOT NULL,
	`es_name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `category_en_name_unique` ON `category` (`en_name`);--> statement-breakpoint
CREATE UNIQUE INDEX `category_fr_name_unique` ON `category` (`fr_name`);--> statement-breakpoint
CREATE UNIQUE INDEX `category_es_name_unique` ON `category` (`es_name`);--> statement-breakpoint
CREATE TABLE `ftags` (
	`id` text PRIMARY KEY NOT NULL,
	`tag_name` text NOT NULL,
	`en_tag_value` text NOT NULL,
	`fr_tag_value` text NOT NULL,
	`es_tag_value` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ftags_en_tag_value_unique` ON `ftags` (`en_tag_value`);--> statement-breakpoint
CREATE UNIQUE INDEX `ftags_fr_tag_value_unique` ON `ftags` (`fr_tag_value`);--> statement-breakpoint
CREATE UNIQUE INDEX `ftags_es_tag_value_unique` ON `ftags` (`es_tag_value`);--> statement-breakpoint
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
	`book_price_reduction_rate_on_threshold_reached` numeric NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `service_ratings` (
	`id` text PRIMARY KEY NOT NULL,
	`client_id` text NOT NULL,
	`rating` integer NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`client_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
