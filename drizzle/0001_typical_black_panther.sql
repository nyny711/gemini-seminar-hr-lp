CREATE TABLE `seminar_registrations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`company_name` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`position` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(50) NOT NULL,
	`challenge` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `seminar_registrations_id` PRIMARY KEY(`id`)
);
