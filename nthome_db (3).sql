-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 25, 2025 at 12:51 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nthome_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `cards`
--

CREATE TABLE `cards` (
  `id` int(11) NOT NULL,
  `card_number` varchar(16) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cards`
--

INSERT INTO `cards` (`id`, `card_number`, `user_id`, `created_at`) VALUES
(10, '9999999999999', 22, '2024-09-19 07:17:51'),
(11, '9999999999999', 22, '2024-09-19 07:51:57');

-- --------------------------------------------------------

--
-- Table structure for table `car_listing`
--

CREATE TABLE `car_listing` (
  `id` int(11) NOT NULL,
  `car_make` varchar(255) DEFAULT NULL,
  `car_model` varchar(255) DEFAULT NULL,
  `car_year` int(11) DEFAULT NULL,
  `number_of_seats` int(11) DEFAULT NULL,
  `car_colour` varchar(255) DEFAULT NULL,
  `car_image` varchar(255) DEFAULT NULL,
  `license_plate` varchar(50) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `class` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `car_listing`
--

INSERT INTO `car_listing` (`id`, `car_make`, `car_model`, `car_year`, `number_of_seats`, `car_colour`, `car_image`, `license_plate`, `userId`, `class`) VALUES
(12, 'Toyota', 'Corolla', 2024, 4, 'black', 'Volkswagen-Polo-GTS-250-TSI-2024-380x238.webp', 'ABC123', 22, 2),
(13, 'BMW', 'BMW', 2023, 4, 'red', 'HD-wallpaper-volkswagen-polo-worthersee-09-concept-in-pink-color-car-pink-cars-volkswagen-polo-concept-cars-car-back-pose.jpg', 'MB1256', 23, 1),
(14, 'BMW', 'BMW', 2024, 4, 'black', 'Volkswagen-Polo-GTS-250-TSI-2024-380x238.webp', '123abd', 24, 1);

-- --------------------------------------------------------

--
-- Table structure for table `contact_support`
--

CREATE TABLE `contact_support` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` varchar(255) NOT NULL,
  `status` enum('unread','read') DEFAULT 'unread',
  `contact_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `disability`
--

CREATE TABLE `disability` (
  `id` int(11) NOT NULL,
  `have_disability` tinyint(1) NOT NULL,
  `disability_type` varchar(255) DEFAULT NULL,
  `additional_details` text DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `disability`
--

INSERT INTO `disability` (`id`, `have_disability`, `disability_type`, `additional_details`, `user_id`) VALUES
(99, 0, NULL, NULL, 18),
(100, 0, NULL, NULL, 18),
(101, 0, NULL, NULL, 18),
(102, 0, NULL, NULL, 18),
(103, 0, NULL, NULL, NULL),
(104, 0, NULL, NULL, NULL),
(105, 0, NULL, NULL, NULL),
(106, 0, NULL, NULL, NULL),
(107, 0, NULL, NULL, NULL),
(108, 0, NULL, NULL, NULL),
(109, 0, NULL, NULL, 18),
(110, 0, NULL, NULL, 18),
(111, 0, NULL, NULL, 18),
(112, 0, NULL, NULL, 18),
(113, 0, NULL, NULL, 18),
(114, 0, NULL, NULL, 18),
(115, 0, NULL, NULL, 18),
(116, 0, NULL, NULL, 18),
(117, 0, NULL, NULL, 18),
(118, 0, NULL, NULL, 18),
(119, 0, NULL, NULL, 18),
(120, 0, NULL, NULL, 18),
(121, 0, NULL, NULL, 18),
(122, 0, NULL, NULL, 18),
(123, 0, NULL, NULL, 18),
(124, 0, NULL, NULL, 18),
(125, 0, NULL, NULL, 18),
(126, 0, NULL, NULL, 18),
(127, 0, NULL, NULL, 18),
(128, 0, NULL, NULL, 18),
(129, 0, NULL, NULL, 18),
(130, 0, NULL, NULL, 18),
(131, 0, NULL, NULL, 18),
(132, 0, NULL, NULL, 18),
(133, 0, NULL, NULL, 18),
(134, 0, NULL, NULL, 18),
(135, 0, NULL, NULL, 18),
(136, 0, NULL, NULL, 18),
(137, 0, NULL, NULL, 18),
(138, 0, NULL, NULL, 18),
(139, 0, NULL, NULL, 18),
(140, 0, NULL, NULL, 18),
(141, 0, NULL, NULL, 18),
(142, 0, NULL, NULL, 18),
(143, 0, NULL, NULL, 18),
(144, 0, NULL, NULL, 18),
(145, 0, NULL, NULL, 18),
(146, 0, NULL, NULL, 18),
(147, 0, NULL, NULL, 18),
(148, 0, NULL, NULL, 18),
(149, 0, NULL, NULL, 18),
(150, 0, NULL, NULL, 18),
(151, 0, NULL, NULL, 18),
(152, 0, NULL, NULL, 18),
(153, 0, NULL, NULL, 18),
(154, 0, NULL, NULL, 18),
(155, 0, NULL, NULL, 18),
(156, 0, NULL, NULL, 18),
(157, 0, NULL, NULL, 18),
(158, 0, NULL, NULL, 18),
(159, 0, NULL, NULL, 18),
(160, 0, NULL, NULL, 18),
(161, 0, NULL, NULL, 18),
(162, 0, NULL, NULL, 18),
(163, 0, NULL, NULL, 18),
(164, 0, NULL, NULL, 18),
(165, 0, NULL, NULL, 18),
(166, 0, NULL, NULL, 18),
(167, 0, NULL, NULL, 18),
(168, 0, NULL, NULL, 18),
(169, 0, NULL, NULL, 18);

-- --------------------------------------------------------

--
-- Table structure for table `driver`
--

CREATE TABLE `driver` (
  `id` int(11) NOT NULL,
  `photo` varchar(255) NOT NULL,
  `id_copy` varchar(255) NOT NULL,
  `gender` varchar(50) NOT NULL,
  `users_id` int(50) NOT NULL,
  `police_clearance` varchar(255) DEFAULT NULL,
  `pdp` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `state` varchar(50) DEFAULT 'online',
  `URL_payment` varchar(255) NOT NULL,
  `online_time` time DEFAULT '00:00:00',
  `last_online_timestamp` datetime DEFAULT NULL,
  `car_inspection` varchar(255) NOT NULL,
  `current_lat` decimal(9,6) DEFAULT NULL,
  `current_lng` decimal(9,6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `driver`
--

INSERT INTO `driver` (`id`, `photo`, `id_copy`, `gender`, `users_id`, `police_clearance`, `pdp`, `status`, `state`, `URL_payment`, `online_time`, `last_online_timestamp`, `car_inspection`, `current_lat`, `current_lng`) VALUES
(15, 'black-woman-arms-crossed-standing-600nw-2254569139.jpg', 'ZA_Smart_ID_Front.pdf', 'Female', 22, 'police clearance.pdf', 'drivers licence with pdp.pdf', 'approved', 'offline', 'pastack', '00:00:05', '2024-09-19 00:48:52', 'reqistration og motor vehicle.pdf', -25.485349, 28.100866),
(16, 'black-woman-arms-crossed-standing-600nw-2254569139.jpg', 'ZA_Smart_ID_Front.pdf', 'Female', 23, 'police clearance.pdf', 'drivers licence with pdp.pdf', 'approved', 'online', 'https://paystack.com/pay/nthomedrivers', '00:00:00', '2024-10-29 02:33:18', 'motor vehicle licence.pdf', -25.484293, 28.102466),
(17, 'Screenshot (31).png', 'ZA_Smart_ID_Front.pdf', 'Male', 24, 'police clearance.pdf', 'drivers licence with pdp.pdf', 'approved', 'offline', 'https://paystack.com/pay/nthomedrivers', '00:00:00', NULL, 'motor vehicle licence.pdf', -25.488979, 28.101021);

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `content` text NOT NULL,
  `rating` int(11) NOT NULL,
  `role` enum('driver','customer') NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`id`, `userId`, `content`, `rating`, `role`, `createdAt`) VALUES
(8, 22, 'Thank you for riding with us', 2, 'driver', '2024-09-19 07:52:37');

-- --------------------------------------------------------

--
-- Table structure for table `passwordresets`
--

CREATE TABLE `passwordresets` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `otp` varchar(6) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `passwordresets`
--

INSERT INTO `passwordresets` (`id`, `email`, `otp`, `expires_at`, `used`, `created_at`) VALUES
(1, 'leborobynlr1@gmail.com', '769365', '2024-08-28 01:14:58', 1, '2024-08-28 07:59:58'),
(2, 'leborobynlr1@gmail.com', '357860', '2024-09-02 00:17:11', 0, '2024-09-02 07:02:11'),
(3, 'leborobynlr1@gmail.com', '888859', '2024-09-02 00:18:42', 1, '2024-09-02 07:03:42');

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `id` int(11) NOT NULL,
  `tripId` int(11) NOT NULL,
  `paymentType` varchar(50) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `paymentDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `payment_reference` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `push_notifications`
--

CREATE TABLE `push_notifications` (
  `id` int(11) NOT NULL,
  `MessageTo` varchar(255) NOT NULL,
  `Message` text NOT NULL,
  `DateSent` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `push_notifications`
--

INSERT INTO `push_notifications` (`id`, `MessageTo`, `Message`, `DateSent`) VALUES
(9, 'driver', 'Thank you for working with us', '2024-09-19 07:54:20');

-- --------------------------------------------------------

--
-- Table structure for table `recipients`
--

CREATE TABLE `recipients` (
  `id` int(11) NOT NULL,
  `paystack_recipient_id` varchar(255) NOT NULL,
  `bank_code` varchar(50) NOT NULL,
  `country_code` varchar(10) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_four_digits` varchar(4) DEFAULT NULL,
  `is_selected` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `recipients`
--

INSERT INTO `recipients` (`id`, `paystack_recipient_id`, `bank_code`, `country_code`, `user_id`, `created_at`, `last_four_digits`, `is_selected`) VALUES
(1, 'RCP_2zpheb3yohfc275', '470010', 'ZA', 29, '2025-02-18 07:24:24', '2 12', 1),
(2, 'RCP_b2jmom019d0tr9k', '470010', 'ZA', 29, '2025-02-18 12:12:37', '7891', 0);

-- --------------------------------------------------------

--
-- Table structure for table `site_settings`
--

CREATE TABLE `site_settings` (
  `id` int(11) NOT NULL,
  `companyName` varchar(255) NOT NULL,
  `supportEmail` varchar(255) NOT NULL,
  `supportPhone` varchar(255) NOT NULL,
  `driverNotifications` tinyint(1) NOT NULL,
  `riderNotifications` tinyint(1) NOT NULL,
  `promoNotifications` tinyint(1) NOT NULL,
  `baseFareBlack` decimal(10,2) NOT NULL,
  `baseFareX` decimal(10,2) NOT NULL,
  `perKMRateBlack` decimal(10,2) NOT NULL,
  `perKMRateX` decimal(10,2) NOT NULL,
  `perMonthRate` decimal(10,2) NOT NULL,
  `perWeekRate` decimal(10,2) NOT NULL,
  `workingHours` int(11) NOT NULL,
  `cancellationFee` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `site_settings`
--

INSERT INTO `site_settings` (`id`, `companyName`, `supportEmail`, `supportPhone`, `driverNotifications`, `riderNotifications`, `promoNotifications`, `baseFareBlack`, `baseFareX`, `perKMRateBlack`, `perKMRateX`, `perMonthRate`, `perWeekRate`, `workingHours`, `cancellationFee`) VALUES
(1, 'Nthome Ridez', 'info@nthome.com', '+27 84 234 6914 / +27 84 234 6918', 1, 1, 1, 16.00, 21.00, 15.00, 10.00, 1500.00, 400.00, 12, 5.00);

-- --------------------------------------------------------

--
-- Table structure for table `subscriptions`
--

CREATE TABLE `subscriptions` (
  `id` int(11) NOT NULL,
  `statuses` tinyint(1) NOT NULL,
  `plan_name` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) NOT NULL,
  `authorization_code` varchar(255) DEFAULT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `customer_code` varchar(255) DEFAULT NULL,
  `recipient_code` varchar(255) NOT NULL,
  `customer_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subscriptions`
--

INSERT INTO `subscriptions` (`id`, `statuses`, `plan_name`, `amount`, `created_at`, `user_id`, `authorization_code`, `reference`, `customer_code`, `recipient_code`, `customer_id`) VALUES
(12, 1, 'Monthly Plan', 1500.00, '2024-09-19 14:48:07', 22, 'bsezczze8s', '189518776', 'CUS_v13m9ucrgxa3z79', '', NULL),
(13, 1, 'Monthly Plan', 1500.00, '2024-10-23 16:39:07', 23, 'elquih5lmt', '199639224', 'CUS_qzz1tahdot5r92f', '', NULL),
(15, 1, 'Monthly Plan', 1500.00, '2024-11-20 11:54:23', 23, 'kg9encm8z9', '199639224', 'CUS_qzz1tahdot5r92f', '', NULL),
(43, 1, 'Weekly', 400.00, '2025-02-25 11:42:58', 30, 'AUTH_pqj2g1mi90', '0edbkwec6v', 'CUS_v13m9ucrgxa3z79', '', '189518776');

-- --------------------------------------------------------

--
-- Table structure for table `trip`
--

CREATE TABLE `trip` (
  `id` int(11) NOT NULL,
  `customerId` int(11) DEFAULT NULL,
  `driverId` int(11) DEFAULT NULL,
  `requestDate` datetime DEFAULT NULL,
  `currentDate` datetime DEFAULT NULL,
  `pickUpLocation` varchar(255) DEFAULT NULL,
  `dropOffLocation` varchar(255) DEFAULT NULL,
  `statuses` varchar(50) DEFAULT NULL,
  `duration_minutes` int(11) DEFAULT NULL,
  `vehicle_type` varchar(50) DEFAULT NULL,
  `distance_traveled` decimal(10,2) DEFAULT NULL,
  `payment_status` varchar(50) DEFAULT NULL,
  `cancellation_reason` text DEFAULT NULL,
  `cancel_by` varchar(20) DEFAULT NULL,
  `pickupTime` time DEFAULT NULL,
  `dropOffTime` time DEFAULT NULL,
  `driver_ratings` decimal(2,1) DEFAULT NULL,
  `driver_feedback` text DEFAULT NULL,
  `customer_rating` decimal(2,1) DEFAULT NULL,
  `customer_feedback` text DEFAULT NULL,
  `pickUpCoordinates` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`pickUpCoordinates`)),
  `dropOffCoordinates` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dropOffCoordinates`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `role` varchar(100) NOT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `lastName` varchar(100) DEFAULT NULL,
  `current_address` varchar(255) DEFAULT NULL,
  `gender` enum('male','female') NOT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `user_uid` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `phoneNumber`, `address`, `lastName`, `current_address`, `gender`, `profile_picture`, `user_uid`) VALUES
(1, 'Admin', 'Admin@gmail.com', 'Admin@123', 'admin', '0712345689', '123 sec A GP', 'Nthome', 'mamelodi ext 4', 'male', 'black-woman-arms-crossed-standing-600nw-2254569139-1724309117249.jpg', ''),
(18, 'rebotilwe ', 'rebotilwemokiba@gmail.com', 'Bobo.98@', 'customer', '0648513696', 'soshanguve', 'Nthome', NULL, 'female', 'portrait-serious-curly-haired-woman-600nw-2315885157-1725873167441.jpg', ''),
(22, 'phuthu', '0604749776kb@gmail.com', 'n.H0761567904', 'driver', NULL, NULL, NULL, NULL, 'male', 'black-woman-arms-crossed-standing-600nw-2254569139-1726730074840.jpg', ''),
(23, 'Happiness', 'happinessnkosi38@gmail.com', 'Happy@123', 'driver', NULL, NULL, NULL, NULL, 'female', 'black-woman-arms-crossed-standing-600nw-2254569139-1729669787932.jpg', ''),
(24, 'kabelo MB', 'kabelo@gmail.com', 'N.h0834323138', 'driver', NULL, NULL, NULL, NULL, '', 'Screenshot (31)-1729676990521.png', ''),
(27, 'mfundo', 'nomfundothe97@gmail.com', '12345678', 'driver', NULL, NULL, NULL, NULL, 'female', NULL, ''),
(29, 'Bobo', 'rebotilwemokiba@gmail.com', '1234567', 'driver', NULL, NULL, NULL, NULL, 'male', NULL, 'opAlioPODVVISG2mVeUsoZZR9Ew1'),
(30, 'kabelo', '0604749776kb@gmail.com', '12345678', 'driver', NULL, NULL, NULL, NULL, 'male', NULL, 'UDiZNk2ozqbK1L62ZdWRlc9teWt2');

-- --------------------------------------------------------

--
-- Table structure for table `vehicle`
--

CREATE TABLE `vehicle` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `image` varchar(255) NOT NULL,
  `costPerKm` decimal(10,2) NOT NULL,
  `status` varchar(20) NOT NULL,
  `description` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vehicle`
--

INSERT INTO `vehicle` (`id`, `name`, `image`, `costPerKm`, `status`, `description`) VALUES
(1, 'nthome_black', 'nthome_black.png\n', 15.00, 'Active', 'Luxury'),
(2, 'nthome_x', 'nthome_x.png', 10.00, 'Active', 'Executive');

-- --------------------------------------------------------

--
-- Table structure for table `wallets`
--

CREATE TABLE `wallets` (
  `id` int(11) NOT NULL,
  `driver_id` int(11) NOT NULL,
  `balance` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `withdrawals`
--

CREATE TABLE `withdrawals` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `withdrawal_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('pending','completed','failed') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cards`
--
ALTER TABLE `cards`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `car_listing`
--
ALTER TABLE `car_listing`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `fk_car_listing_class` (`class`);

--
-- Indexes for table `contact_support`
--
ALTER TABLE `contact_support`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `disability`
--
ALTER TABLE `disability`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `driver`
--
ALTER TABLE `driver`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Test` (`users_id`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `passwordresets`
--
ALTER TABLE `passwordresets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tripId` (`tripId`);

--
-- Indexes for table `push_notifications`
--
ALTER TABLE `push_notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `recipients`
--
ALTER TABLE `recipients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `site_settings`
--
ALTER TABLE `site_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `trip`
--
ALTER TABLE `trip`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customerId` (`customerId`),
  ADD KEY `driverId` (`driverId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_roles` (`role`);

--
-- Indexes for table `vehicle`
--
ALTER TABLE `vehicle`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `wallets`
--
ALTER TABLE `wallets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `driver_id` (`driver_id`);

--
-- Indexes for table `withdrawals`
--
ALTER TABLE `withdrawals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cards`
--
ALTER TABLE `cards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `car_listing`
--
ALTER TABLE `car_listing`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `contact_support`
--
ALTER TABLE `contact_support`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `disability`
--
ALTER TABLE `disability`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=170;

--
-- AUTO_INCREMENT for table `driver`
--
ALTER TABLE `driver`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `passwordresets`
--
ALTER TABLE `passwordresets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `push_notifications`
--
ALTER TABLE `push_notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `recipients`
--
ALTER TABLE `recipients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `site_settings`
--
ALTER TABLE `site_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `trip`
--
ALTER TABLE `trip`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `vehicle`
--
ALTER TABLE `vehicle`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `wallets`
--
ALTER TABLE `wallets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `withdrawals`
--
ALTER TABLE `withdrawals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `car_listing`
--
ALTER TABLE `car_listing`
  ADD CONSTRAINT `car_listing_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `fk_car_listing_class` FOREIGN KEY (`class`) REFERENCES `vehicle` (`id`);

--
-- Constraints for table `disability`
--
ALTER TABLE `disability`
  ADD CONSTRAINT `disability_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `driver`
--
ALTER TABLE `driver`
  ADD CONSTRAINT `Test` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`tripId`) REFERENCES `trip` (`id`);

--
-- Constraints for table `recipients`
--
ALTER TABLE `recipients`
  ADD CONSTRAINT `recipients_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD CONSTRAINT `subscriptions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `trip`
--
ALTER TABLE `trip`
  ADD CONSTRAINT `trip_ibfk_1` FOREIGN KEY (`customerId`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `trip_ibfk_2` FOREIGN KEY (`driverId`) REFERENCES `users` (`id`);

--
-- Constraints for table `wallets`
--
ALTER TABLE `wallets`
  ADD CONSTRAINT `wallets_ibfk_1` FOREIGN KEY (`driver_id`) REFERENCES `driver` (`id`);

--
-- Constraints for table `withdrawals`
--
ALTER TABLE `withdrawals`
  ADD CONSTRAINT `withdrawals_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
