/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES  */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DELETE FROM "AttachmentOnReport";
/*!40000 ALTER TABLE "AttachmentOnReport" DISABLE KEYS */;
/*!40000 ALTER TABLE "AttachmentOnReport" ENABLE KEYS */;

DELETE FROM "attachments";
/*!40000 ALTER TABLE "attachments" DISABLE KEYS */;
INSERT INTO "attachments" ("id", "url", "desc", "lat", "lon", "datetime", "taskCommentId", "reportId", "user_id", "type", "taskId") VALUES
	(1, 'development/uploads/3cdb7f73-bc42-413a-b387-0a901e3e5aeb.jpg', 'this is desc', NULL, NULL, '2023-07-26 12:56:02.539', NULL, NULL, 1, 'IMAGE', NULL),
	(2, 'http://localhost:8000/uploads/877a110e-a64e-4b05-b3ca-d234a4d52837.jpg', 'this is desc', NULL, NULL, '2023-07-26 12:56:48.913', NULL, NULL, 1, 'IMAGE', NULL);
/*!40000 ALTER TABLE "attachments" ENABLE KEYS */;

DELETE FROM "invites";
/*!40000 ALTER TABLE "invites" DISABLE KEYS */;
INSERT INTO "invites" ("id", "phone", "project_id", "role", "status", "date", "invited_by", "user_id") VALUES
	(1, '705-592-1408', 1, 'LOGISTICS_MANAGER', 'ACCEPTED', NULL, NULL, 1),
	(2, '705-592-1411', 1, 'LOGISTICS_MANAGER', 'ACCEPTED', NULL, NULL, 4),
	(3, '705-592-1422', 1, 'LOGISTICS_MANAGER', 'ACCEPTED', NULL, NULL, 5),
	(4, '705-592-1433', 1, 'LOGISTICS_MANAGER', 'ACCEPTED', NULL, NULL, 6);
/*!40000 ALTER TABLE "invites" ENABLE KEYS */;

DELETE FROM "projects";
/*!40000 ALTER TABLE "projects" DISABLE KEYS */;
INSERT INTO "projects" ("id", "name", "joining_code", "description", "start_date", "deadline", "labels", "status", "user_id") VALUES
	(1, 'Unbranded Soft Chicken', '9MHYOOIJ', 'the', '2023-07-20 00:00:00', '2023-07-20 00:00:00', '{the}', 'the status', 1);
/*!40000 ALTER TABLE "projects" ENABLE KEYS */;

DELETE FROM "reports";
/*!40000 ALTER TABLE "reports" DISABLE KEYS */;
/*!40000 ALTER TABLE "reports" ENABLE KEYS */;

DELETE FROM "report_types";
/*!40000 ALTER TABLE "report_types" DISABLE KEYS */;
INSERT INTO "report_types" ("id", "title", "icon", "desc") VALUES
	(1, 'Deviation', NULL, NULL),
	(2, 'Material Checkpoint', NULL, NULL),
	(3, 'Material handling', NULL, NULL),
	(4, 'Bin Waste report', NULL, NULL),
	(5, 'Truck loading/unloading', NULL, NULL),
	(6, 'Rules/ADP Plans', NULL, NULL),
	(7, 'Injury report', NULL, NULL);
/*!40000 ALTER TABLE "report_types" ENABLE KEYS */;

DELETE FROM "tasks";
/*!40000 ALTER TABLE "tasks" DISABLE KEYS */;
/*!40000 ALTER TABLE "tasks" ENABLE KEYS */;

DELETE FROM "task_comments";
/*!40000 ALTER TABLE "task_comments" DISABLE KEYS */;
/*!40000 ALTER TABLE "task_comments" ENABLE KEYS */;

DELETE FROM "users";
/*!40000 ALTER TABLE "users" DISABLE KEYS */;
INSERT INTO "users" ("id", "email", "phone", "first_name", "last_name", "push_token", "password", "social_id", "social_login_provider", "role") VALUES
	(1, NULL, '705-592-1408', NULL, NULL, NULL, NULL, NULL, NULL, 'PROJECT_MANAGER'),
	(4, NULL, '705-592-1411', NULL, NULL, NULL, NULL, NULL, NULL, 'PROJECT_MANAGER'),
	(5, NULL, '705-592-1422', NULL, NULL, NULL, NULL, NULL, NULL, 'PROJECT_MANAGER'),
	(6, NULL, '705-592-1433', NULL, NULL, NULL, NULL, NULL, NULL, 'PROJECT_MANAGER');
/*!40000 ALTER TABLE "users" ENABLE KEYS */;

DELETE FROM "_prisma_migrations";
/*!40000 ALTER TABLE "_prisma_migrations" DISABLE KEYS */;
INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "logs", "rolled_back_at", "started_at", "applied_steps_count") VALUES
	('c86dee2b-01b0-43f6-97e9-bdb1c303ab10', 'e83ab8a6085691bab905237a73768153135d06bea5f6a533af024ddcc4ea0058', '2023-07-24 17:43:51.592035+06', '20230724112008_init', NULL, NULL, '2023-07-24 17:43:51.350979+06', 1),
	('e6b4b39e-f170-4d34-b1b3-1e65e9cf2498', 'a4bb79c7e4d9b0659c6fa4722369a70f5b7ca7bc73911788b539667c37e8b89b', '2023-07-24 17:47:12.529259+06', '20230724114712_init', NULL, NULL, '2023-07-24 17:47:12.522822+06', 1),
	('089a931b-1291-40ab-b9fd-4fee9e401a48', '7e102016f97787dbdcd10002d5253037233becf64d84f53f925dbbac7dd52eae', '2023-07-25 13:01:04.60376+06', '20230725070104_init', NULL, NULL, '2023-07-25 13:01:04.591954+06', 1);
INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "logs", "rolled_back_at", "started_at", "applied_steps_count") VALUES
	('75082da9-80cb-49ec-8353-39d9773333a0', '87147fc040c1d934de4c5337b0ba0a00af5fe00d824b4a4a52b43601c6530ef1', '2023-07-26 12:46:32.647702+06', '20230726064632_init', NULL, NULL, '2023-07-26 12:46:32.632473+06', 1),
	('3b46990a-6d75-48cd-88a1-6e02fc8ab0b2', 'b3ca51cb5651ce826ba4b90e2fbb947aa2c0c9f1c421aca7567835b283127483', '2023-07-26 12:57:41.264507+06', '20230726065741_init', NULL, NULL, '2023-07-26 12:57:41.248427+06', 1),
	('10829a01-cec4-40b5-921a-363d92ab3f56', '53cb3ab2fa45bcd399414f4958bbcd5bb7aa2be6488a8839d6f37756359fad1f', '2023-07-26 18:18:35.760441+06', '20230726121835_init', NULL, NULL, '2023-07-26 18:18:35.751452+06', 1);
INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "logs", "rolled_back_at", "started_at", "applied_steps_count") VALUES
	('862c3546-9bd7-4140-87fb-97e7dce74160', 'e98646d50c75ef7faf7bd27866e484f85af57c70605e541bde59db7a84351370', '2023-07-26 19:02:15.951621+06', '20230726130215_init', NULL, NULL, '2023-07-26 19:02:15.934932+06', 1);
/*!40000 ALTER TABLE "_prisma_migrations" ENABLE KEYS */;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
