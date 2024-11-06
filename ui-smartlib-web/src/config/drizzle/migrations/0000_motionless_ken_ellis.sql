CREATE TABLE `books_copies` (
	`id` text PRIMARY KEY NOT NULL,
	`book_id` text NOT NULL,
	`isbn` text NOT NULL,
	`is_available` integer DEFAULT true NOT NULL,
	`at_position` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`isbn`) REFERENCES `books_edition`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `books_edition` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `books_images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`url` text NOT NULL,
	`book_id` text NOT NULL,
	`isbn` text NOT NULL,
	`isSincronized` integer DEFAULT false
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
	`status` text DEFAULT 'onschedule' NOT NULL,
	`start_time` text DEFAULT (current_timestamp),
	`end_time` text,
	`created_at` text DEFAULT (current_timestamp),
	`updated_at` text DEFAULT (current_timestamp)
);
--> statement-breakpoint
CREATE TABLE `books` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`price` integer NOT NULL,
	`author` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `cart_item` (
	`id` text PRIMARY KEY NOT NULL,
	`isbn` text NOT NULL,
	`qty` integer NOT NULL,
	`cart_id` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`isbn`) REFERENCES `books_edition`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`cart_id`) REFERENCES `cart`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `cart_idx` ON `cart_item` (`cart_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `cart_item_cart_id_isbn_unique` ON `cart_item` (`cart_id`,`isbn`);--> statement-breakpoint
CREATE TABLE `cart` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`state` text DEFAULT 'PENDING' NOT NULL,
	`created_at` text DEFAULT (current_timestamp),
	`updated_at` text DEFAULT (current_timestamp),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`pin` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`organization_id` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `organization` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
