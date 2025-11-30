CREATE TABLE `popularPrompts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`prompt` text NOT NULL,
	`usageType` varchar(50) NOT NULL,
	`category` varchar(50) NOT NULL,
	`rating` int NOT NULL DEFAULT 0,
	`usageCount` int NOT NULL DEFAULT 0,
	`likesCount` int NOT NULL DEFAULT 0,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `popularPrompts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `promptRatings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`promptId` int NOT NULL,
	`userId` int NOT NULL,
	`rating` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `promptRatings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `savedPrompts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`basePrompt` text NOT NULL,
	`enhancedPrompt` text NOT NULL,
	`usageType` varchar(50) NOT NULL,
	`tags` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `savedPrompts_id` PRIMARY KEY(`id`)
);
