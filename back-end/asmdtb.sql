CREATE DATABASE  IF NOT EXISTS `asm1` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `asm1`;
-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: localhost    Database: asm1
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'áo'),(2,'quần'),(3,'đồ bộ');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `colors`
--

DROP TABLE IF EXISTS `colors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `colors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `id_product` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `colors_ibfk_1` (`id_product`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `colors`
--

LOCK TABLES `colors` WRITE;
/*!40000 ALTER TABLE `colors` DISABLE KEYS */;
INSERT INTO `colors` VALUES (1,'Xanh',9),(2,'Đen',9),(4,'Đen',28),(5,'Xanh',28),(6,'Xanh',10),(7,'Xanh Đen',10),(8,'Lam',28),(9,'Đen',8),(10,'Cam',8);
/*!40000 ALTER TABLE `colors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_user` int DEFAULT NULL,
  `id_payment` int DEFAULT NULL,
  `name` varchar(100) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `phone` int NOT NULL,
  `email` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `address` varchar(200) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `note` varchar(250) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `paymentMethod` varchar(200) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `totalPrice` int NOT NULL,
  `status` varchar(50) COLLATE utf8mb3_unicode_ci DEFAULT 'pending' COMMENT '''pending'', ''completed'', ''canceled''',
  `order_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `orders_ibfk_1` (`id_payment`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`id_payment`) REFERENCES `payment` (`id`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (33,14,NULL,'hieutn-vps',342895837,'hieutn-vps@gmail.com','hieutn-vps','','1',700000,'delivered','2025-03-02 01:17:12'),(34,14,NULL,'hieutn-vps',342895837,'hieutn-vps@gmail.com','hieutn-vps','','1',1400000,'pending','2025-03-02 01:17:12'),(35,14,NULL,'hieutn-vps',342895837,'hieutn-vps@gmail.com','hieutn-vps','','1',780000,'delivered','2025-03-04 11:34:33'),(36,14,NULL,'hieutn-vps',342895837,'hieutn-vps@gmail.com','hieutn-vps','','1',450000,'cancelled','2025-03-04 21:38:41'),(37,14,NULL,'hieutn-vps',342895837,'hieutn-vps@gmail.com','hieutn-vps','','1',390000,'delivered','2025-03-04 21:39:21');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders_detail`
--

DROP TABLE IF EXISTS `orders_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders_detail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_orders` int NOT NULL,
  `id_product` int NOT NULL,
  `price` int NOT NULL,
  `quantity` int NOT NULL,
  `size` int DEFAULT NULL,
  `color` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_product` (`id_product`),
  KEY `id_orders` (`id_orders`),
  CONSTRAINT `orders_detail_ibfk_1` FOREIGN KEY (`id_product`) REFERENCES `products` (`id`),
  CONSTRAINT `orders_detail_ibfk_2` FOREIGN KEY (`id_orders`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders_detail`
--

LOCK TABLES `orders_detail` WRITE;
/*!40000 ALTER TABLE `orders_detail` DISABLE KEYS */;
INSERT INTO `orders_detail` VALUES (8,33,9,350000,1,1,2),(9,33,9,350000,1,1,1),(10,34,9,350000,4,1,1),(11,35,10,390000,1,6,6),(12,35,10,390000,1,13,7),(13,36,8,450000,1,17,9),(14,37,10,390000,1,6,6);
/*!40000 ALTER TABLE `orders_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(10) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES (1,'Zalopay'),(2,'tien_mat');
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb3_unicode_ci NOT NULL,
  `price` int NOT NULL,
  `sale` int DEFAULT NULL,
  `img` varchar(100) COLLATE utf8mb3_unicode_ci NOT NULL,
  `decription` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `id_cate` int NOT NULL,
  `imgHover` varchar(200) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_cate` (`id_cate`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`id_cate`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (3,'Quần Jean Nữ Nhạt',350000,400000,'v16.1.webp','',2,'v16.2.webp'),(4,'Quần Jean Nữ Ống Lòe',250000,200000,'v15.1.webp','',2,'v15.2.webp'),(5,'Quần Jean Nữ Dáng Flare',350000,400000,'v14.1.webp','',2,'v14.2.webp'),(6,'Quần Jean Nữ Ống Rộng',450000,400000,'v13.1.webp','',2,'v13.2.webp'),(7,'Quần Jean Form Rộng',250000,200000,'v12.1.webp','',2,'v12.2.webp'),(8,'Quần Jean Nổi Chỉ',450000,300000,'v11.1.webp','',2,'v11.2.webp'),(9,'Quần Jean Basic',350000,300000,'v10.1.webp','',2,'v10.2.webp'),(10,'Quần Jean Suông',390000,400000,'v9.1.webp','',2,'v9.2.webp'),(11,'Áo NEWYORK',390000,400000,'v8.1.webp','',1,'v8.2.webp'),(13,'Áo Khoác Nữ Viền Túi',395000,300000,'v7.1.webp','',1,'v7.2.webp'),(14,'Áo Nỉ In Công Chúa',395000,400000,'v6.1.webp','',1,'v6.2.webp'),(15,'Áo Nỉ HP',350000,200000,'v5.1.webp','',1,'v5.2.webp'),(16,'Áo Nỉ KIRKWOOD',250000,400000,'v4.1.webp','',1,'v4.2.webp'),(27,'Áo Nỉ Nam In Hình',240000,NULL,'v3.1.webp',NULL,1,'v3.2.webp'),(28,'Áo Khoác Nam',350000,NULL,'v2.1.webp',NULL,1,'v2.2.webp');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products_variants`
--

DROP TABLE IF EXISTS `products_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products_variants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `size_id` int NOT NULL,
  `color_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `products_variants_ibfk_1` (`product_id`),
  KEY `products_variants_ibfk_2` (`size_id`),
  KEY `products_variants_ibfk_3` (`color_id`),
  CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`color_id`) REFERENCES `colors` (`id`),
  CONSTRAINT `product_variants_ibfk_2` FOREIGN KEY (`size_id`) REFERENCES `sizes` (`id`),
  CONSTRAINT `product_variants_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products_variants`
--

LOCK TABLES `products_variants` WRITE;
/*!40000 ALTER TABLE `products_variants` DISABLE KEYS */;
INSERT INTO `products_variants` VALUES (1,9,1,1);
/*!40000 ALTER TABLE `products_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `content` text COLLATE utf8mb4_general_ci NOT NULL,
  `updated_at` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `review_ibfk_1` (`product_id`),
  KEY `review_ibfk_2` (`user_id`),
  CONSTRAINT `review_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `review_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
INSERT INTO `review` VALUES (1,12,3,'mnn','2025-02-24'),(2,12,10,'dep','2025-02-24');
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sizes`
--

DROP TABLE IF EXISTS `sizes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sizes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `id_product` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sizes_ibfk_1` (`id_product`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sizes`
--

LOCK TABLES `sizes` WRITE;
/*!40000 ALTER TABLE `sizes` DISABLE KEYS */;
INSERT INTO `sizes` VALUES (1,'S',9),(2,'M',9),(5,'L',9),(6,'S',10),(9,'S',28),(10,'M',28),(11,'L',28),(13,'M',10),(14,'L',10),(16,'XL',28),(17,'S',8),(18,'M',8),(19,'L',8),(20,'XL',8);
/*!40000 ALTER TABLE `sizes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(251) COLLATE utf8mb3_unicode_ci NOT NULL,
  `pass` varchar(10) COLLATE utf8mb3_unicode_ci NOT NULL,
  `phone` double DEFAULT NULL,
  `email` varchar(200) COLLATE utf8mb3_unicode_ci NOT NULL,
  `address` varchar(100) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `role` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (12,'Trần Tuấn Kiệt','110',84937987796,'kietttps334@fpt.edu.vn','123 phường 14',1),(13,'Trần Tuấn Kiệt997','333',84937987796,'kietttps33874@fpt.edu.vn','123 phường 14',1),(14,'hieutn-vps','zxczxc',342895837,'hieutn-vps@gmail.com','hieutn-vps',1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-04 21:57:28
