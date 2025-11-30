CREATE TABLE `worksheets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`generationMethod` varchar(50) NOT NULL,
	`questionType` varchar(50) NOT NULL,
	`questionCount` int NOT NULL,
	`language` varchar(50) NOT NULL,
	`gradeLevel` varchar(50) NOT NULL,
	`lessonTitle` varchar(255) NOT NULL,
	`teacherName` varchar(255),
	`schoolName` varchar(255),
	`content` text NOT NULL,
	`sourceText` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `worksheets_id` PRIMARY KEY(`id`)
);
