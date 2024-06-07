/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES  */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

/*!40000 ALTER TABLE "report_types" DISABLE KEYS */;
INSERT INTO "report_types" ("title", "icon", "desc") VALUES
	('Deviation', 'http://164.92.125.22:8000/icons/report-dev.png', 'Damaged goods, delayed deliveries, miss ...'),
	('Material handling', 'http://164.92.125.22:8000/icons/report-mat-hand.png', 'Transport material to a specific zone'),
	('Accident report', 'http://164.92.125.22:8000/icons/report-acc.png', 'Description of the report in maximum 2 '),
	('Work environment plan', 'http://164.92.125.22:8000/icons/report-work.png', 'Policy, Regulations, Site plans, Delivery plan'),
	('Material delivery checkpoint', 'http://164.92.125.22:8000/icons/direction.png', 'Description of the report in maximum 2 '),
	('Environment report', 'http://164.92.125.22:8000/icons/report-env.png', 'Order and empty containers and bins');
/*!40000 ALTER TABLE "report_types" ENABLE KEYS */;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;


INSERT INTO "report_types" ("id", "title", "icon", "desc") VALUES
	(1, 'Deviation', 'http://164.92.125.22:8000/uploads/df794c2e-578c-4b4e-8919-10b135b6eb60.png', 'Damaged goods, delayed deliveries, miss ...'),
	(6, 'Environment report', 'http://164.92.125.22:8000/uploads/bdfaca37-c15b-4f19-a566-914b6c72e5f3.png', 'Order and empty containers and bins'),
	(2, 'Material handling', 'http://164.92.125.22:8000/uploads/290e8acf-8fa4-46db-87e6-aeaf1395a75f.png', 'Transport material to a specific zone'),
	(3, 'Accident report', 'http://164.92.125.22:8000/uploads/2a60536c-6f66-4b63-a193-b0ccb026ac1c.png', 'Description of the report in maximum 2 '),
	(4, 'Work environment plan', 'http://164.92.125.22:8000/uploads/9265973e-0c3a-42b2-863a-234ff7040f36.png', 'Policy, Regulations, Site plans, Delivery plan'),
	(5, 'Material delivery checkpoint', 'http://164.92.125.22:8000/uploads/39943b4c-00bb-4c80-a4f0-653c88757b65.png', 'Description of the report in maximum 2 ');
