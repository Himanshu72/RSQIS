-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Feb 13, 2020 at 01:32 PM
-- Server version: 8.0.18
-- PHP Version: 7.3.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rsqis1`
--

-- --------------------------------------------------------

--
-- Table structure for table `workallocated`
--

CREATE TABLE `workallocated` (
  `allocateID` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `workerID` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `adminID` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `roadID` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `Timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `workallocated`
--
ALTER TABLE `workallocated`
  ADD PRIMARY KEY (`allocateID`),
  ADD KEY `adminID` (`adminID`),
  ADD KEY `roadID` (`roadID`),
  ADD KEY `workerID` (`workerID`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `workallocated`
--
ALTER TABLE `workallocated`
  ADD CONSTRAINT `workallocated_ibfk_1` FOREIGN KEY (`adminID`) REFERENCES `users` (`userID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `workallocated_ibfk_2` FOREIGN KEY (`roadID`) REFERENCES `road` (`roadID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `workallocated_ibfk_3` FOREIGN KEY (`workerID`) REFERENCES `users` (`userID`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
