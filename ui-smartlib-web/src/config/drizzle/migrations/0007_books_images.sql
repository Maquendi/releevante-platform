ALTER TABLE `books_images` RENAME COLUMN "images" TO "image";--> statement-breakpoint
ALTER TABLE `books_images` ADD `name` text;