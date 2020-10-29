SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;

SET NAMES utf8mb4;


DROP TABLE IF EXISTS `signing_keys`;
CREATE TABLE `signing_keys` (
  `id` int NOT NULL,
  `latest` varchar(4096) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `previous` varchar(4096) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` varchar(64) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;