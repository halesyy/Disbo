-- Adminer 3.5.1 MySQL dump
 
SET NAMES utf8;
SET foreign_key_checks = 0;
SET time_zone = 'SYSTEM';
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';
 
DROP TABLE IF EXISTS `disbo`.`users`;
CREATE TABLE `disbo`.`users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(15) NOT NULL,
  `sso` varchar(100) NOT NULL,
  `diamonds` int(11) NOT NULL DEFAULT '1000',
  `credits` int(11) NOT NULL DEFAULT '1000',
  `duckets` int(11) NOT NULL DEFAULT '1000',
  `figure` varchar(500) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
 
INSERT INTO `disbo`.`users` (`id`, `username`, `sso`, `diamonds`, `credits`, `duckets`, `figure`) VALUES
(1, 'Test', 'abc',  1000,   1000,   1000,   'sh-3035-82.hd-180-1.ch-3001-82-1408.lg-3290-110.cc-886-110.hr-3278-45-40');
 
-- 2016-02-15 13:59:22