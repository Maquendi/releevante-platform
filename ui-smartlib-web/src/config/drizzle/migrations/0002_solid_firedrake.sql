PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_books_copies` (
	`id` text PRIMARY KEY NOT NULL,
	`book_id` text NOT NULL,
	`isbn` text NOT NULL,
	`is_available` integer DEFAULT true NOT NULL,
	`at_position` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`isbn`) REFERENCES `books_edition`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`at_position`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_books_copies`("id", "book_id", "isbn", "is_available", "at_position", "created_at", "updated_at") SELECT "id", "book_id", "isbn", "is_available", "at_position", "created_at", "updated_at" FROM `books_copies`;--> statement-breakpoint
DROP TABLE `books_copies`;--> statement-breakpoint
ALTER TABLE `__new_books_copies` RENAME TO `books_copies`;--> statement-breakpoint
PRAGMA foreign_keys=ON;