CREATE TABLE `book_category` (
	`id` text PRIMARY KEY NOT NULL,
	`book_id` text,
	`category_id` text,
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `category` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text
);
--> statement-breakpoint
DROP INDEX IF EXISTS `cart_idx`;--> statement-breakpoint
DROP INDEX IF EXISTS `cart_item_cart_id_isbn_unique`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_books_images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`url` text NOT NULL,
	`book_id` text NOT NULL,
	`isbn` text,
	`isSincronized` integer DEFAULT false
);
--> statement-breakpoint
INSERT INTO `__new_books_images`("id", "url", "book_id", "isbn", "isSincronized") SELECT "id", "url", "book_id", "isbn", "isSincronized" FROM `books_images`;--> statement-breakpoint
DROP TABLE `books_images`;--> statement-breakpoint
ALTER TABLE `__new_books_images` RENAME TO `books_images`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `books` ADD `isbn` text REFERENCES books_edition(id);--> statement-breakpoint
ALTER TABLE `books` DROP COLUMN `price`;