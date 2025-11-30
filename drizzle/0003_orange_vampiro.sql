ALTER TABLE `savedPrompts` ADD `shareToken` varchar(64);--> statement-breakpoint
ALTER TABLE `savedPrompts` ADD `isPublic` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `savedPrompts` ADD `shareCount` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `savedPrompts` ADD `viewCount` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `savedPrompts` ADD CONSTRAINT `savedPrompts_shareToken_unique` UNIQUE(`shareToken`);