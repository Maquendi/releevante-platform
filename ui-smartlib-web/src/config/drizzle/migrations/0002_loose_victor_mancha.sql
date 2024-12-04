ALTER TABLE `books` ADD `correlation_id` text NOT NULL;--> statement-breakpoint
ALTER TABLE `books` ADD `language` text NOT NULL;--> statement-breakpoint
ALTER TABLE `books` ADD `description_fr` text NOT NULL;--> statement-breakpoint
ALTER TABLE `books` ADD `description_sp` text NOT NULL;--> statement-breakpoint
ALTER TABLE `books_images` DROP COLUMN `external_id`;