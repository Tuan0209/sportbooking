-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th3 12, 2026 lúc 09:05 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `sportbookingg`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `admin_logs`
--

CREATE TABLE `admin_logs` (
  `id` char(36) NOT NULL,
  `admin_id` char(36) NOT NULL,
  `action` varchar(255) NOT NULL,
  `target_table` varchar(100) NOT NULL,
  `target_id` char(36) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `areas`
--

CREATE TABLE `areas` (
  `id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `city` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bookings`
--

CREATE TABLE `bookings` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `field_id` char(36) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `total_price` decimal(12,2) NOT NULL,
  `status` enum('PENDING','CONFIRMED','COMPLETED','CANCELED') NOT NULL DEFAULT 'PENDING',
  `canceled_at` datetime DEFAULT NULL,
  `canceled_by` char(36) DEFAULT NULL,
  `cancel_reason` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `booking_options`
--

CREATE TABLE `booking_options` (
  `booking_id` char(36) NOT NULL,
  `option_id` char(36) NOT NULL,
  `price_per_hour` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `booking_services`
--

CREATE TABLE `booking_services` (
  `booking_id` char(36) NOT NULL,
  `service_id` char(36) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `favorites`
--

CREATE TABLE `favorites` (
  `user_id` char(36) NOT NULL,
  `field_id` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fields`
--

CREATE TABLE `fields` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `field_type_id` char(36) NOT NULL,
  `area_id` char(36) NOT NULL,
  `address` varchar(255) NOT NULL,
  `price_per_hour` decimal(10,2) NOT NULL,
  `open_time` time NOT NULL,
  `close_time` time NOT NULL,
  `latitude` decimal(10,6) DEFAULT NULL,
  `longitude` decimal(10,6) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE','MAINTENANCE') NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `field_images`
--

CREATE TABLE `field_images` (
  `id` char(36) NOT NULL,
  `field_id` char(36) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `field_options`
--

CREATE TABLE `field_options` ( //là bảng để lưu các tùy chọn của sân như: đèn chiếu sáng, có chỗ để xe, có phòng thay đồ
  `id` char(36) NOT NULL,
  `field_id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price_per_hour` decimal(10,2) NOT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `field_time_blocks`
--

CREATE TABLE `field_time_blocks` (
  `id` char(36) NOT NULL,
  `field_id` char(36) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `field_types`
--

CREATE TABLE `field_types` (  //là bảng để lưu các loại sân như: sân 5, sân 7, sân 11
  `id` char(36) NOT NULL,
  `name` varchar(50) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payments`
--

CREATE TABLE `payments` (
  `id` char(36) NOT NULL,
  `booking_id` char(36) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `method` enum('VNPAY','MOMO','BANK_TRANSFER','COIN') NOT NULL,
  `status` enum('PENDING','PAID','FAILED','EXPIRED','REFUNDED') NOT NULL DEFAULT 'PENDING',
  `transaction_code` varchar(100) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `expired_at` datetime DEFAULT NULL,
  `paid_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `refund_requests`
--

CREATE TABLE `refund_requests` (
  `id` char(36) NOT NULL,
  `booking_id` char(36) NOT NULL,
  `payment_id` char(36) NOT NULL,
  `refund_amount` decimal(12,2) NOT NULL,
  `refund_method` enum('BANK_TRANSFER','COIN') NOT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `bank_account` varchar(50) DEFAULT NULL,
  `bank_account_name` varchar(100) DEFAULT NULL,
  `status` enum('REQUESTED','APPROVED','REJECTED','DONE') NOT NULL DEFAULT 'REQUESTED',
  `admin_id` char(36) DEFAULT NULL,
  `proof_image` varchar(255) DEFAULT NULL,
  `transaction_code` varchar(100) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `completed_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reviews`
--

CREATE TABLE `reviews` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `field_id` char(36) NOT NULL,
  `booking_id` char(36) NOT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `services`
--

CREATE TABLE `services` (
  `id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `unit` varchar(50) NOT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('USER','ADMIN') NOT NULL DEFAULT 'USER',
  `status` enum('ACTIVE','BLOCKED','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `coin_balance` decimal(12,2) NOT NULL DEFAULT 0.00,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `avatar_url` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `role`, `status`, `coin_balance`, `created_at`, `updated_at`, `avatar_url`) VALUES
('03774f21-a403-4101-ac1c-774b1f98fbfc', 'phongbv', 'nlsdfsdddsd@gmail.com', '123sd4456', '0987654321', 'USER', 'ACTIVE', 0.00, '2026-03-01 11:58:13', '2026-03-10 11:49:40', 'https://res.cloudinary.com/di3cbuwx4/image/upload/v1773118178/sport-booking/avatar/03774f21-a403-4101-ac1c-774b1f98fbfc.jpg'),
('07bacb48-6a3a-4e82-b000-e288d6831c05', 'sNedsfddsdd', 'nlsdfsdsssddsrd@gmail.com', '$2a$10$/8mkjgcogPWkckhs6Ujz1eA8o7YhDHZjhOzn20yh9gjKqWA6dDYNm', '0987654361', 'USER', 'INACTIVE', 0.00, '2026-03-10 11:10:57', '2026-03-11 14:10:58', 'https://res.cloudinary.com/di3cbuwx4/image/upload/v1773213055/sport-booking/avatar/07bacb48-6a3a-4e82-b000-e288d6831c05.jpg'),
('27535ab8-ecfa-429c-b61d-d7fdcd0fea49', 'User', 'user3@gmail.com', '$2a$10$WZK4dCMoQ0TCftwn2Y3ABea5lCFcG96rGmWUW98kmOKKAJy0kGF7S', '0982826898', 'USER', 'BLOCKED', 0.00, '2026-03-04 15:48:25', '2026-03-11 14:11:59', 'https://res.cloudinary.com/di3cbuwx4/image/upload/v1773213116/sport-booking/avatar/27535ab8-ecfa-429c-b61d-d7fdcd0fea49.jpg'),
('35cdc079-ff1e-4976-85f3-3062fcc0fad4', 'Nam', 'nlam@gmail.com', '123456', '0987654321', 'USER', 'ACTIVE', 0.00, '2026-02-26 20:24:20', '2026-02-26 20:24:20', NULL),
('569d8672-1901-4b54-bb1b-d44b08ba438a', 'sNedsfddsđdd', 'dddđđ@gmail.com', '$2a$10$okNlN9XRPRGp56RHJV3p2eQdP9UsNsYs6WPQtNvrFnLuFOk4NQLTC', NULL, 'USER', 'ACTIVE', 0.00, '2026-03-01 12:09:53', '2026-03-01 12:09:53', NULL),
('679d3327-355b-495d-9a94-702c1610eab7', 'sNedfddsdd', 'nlsdfdds@gmail.com', '123sd4456', '0987654321', 'USER', 'ACTIVE', 0.00, '2026-02-27 11:59:55', '2026-02-27 11:59:55', NULL),
('6d152ad7-4240-48ad-a914-d04216fa4e31', 'sNdfdsdd', 'nlsfs@sesdgmail.com', '123s4456', '0987654321', 'USER', 'ACTIVE', 0.00, '2026-02-27 11:56:14', '2026-02-28 14:53:54', 'https://res.cloudinary.com/di3cbuwx4/image/upload/v1772265211/sport-booking/avatar/6d152ad7-4240-48ad-a914-d04216fa4e31.jpg'),
('7095fff5-acae-48bd-9a8f-ac42ecd8fb5e', 'Nfadm', 'nasfsdm@gmail.com', '123456', '09876s5332', 'USER', 'ACTIVE', 0.00, '2026-02-26 15:44:50', '2026-02-27 11:53:26', NULL),
('7277c126-63dc-440d-8b89-612a2773fdd7', 'sNdddd', 'nls@esdgmail.com', '123s4456', '0987654321', 'USER', 'ACTIVE', 0.00, '2026-02-27 11:50:30', '2026-02-27 11:50:30', NULL),
('7801565f-2e7a-4d2f-bf94-e93502e1f0bd', 'sNedsfddsdd', 'nlsdfsdssddsd@gmail.com', '123sd4456', '0987654321', 'USER', 'ACTIVE', 0.00, '2026-03-02 10:42:49', '2026-03-02 10:42:49', NULL),
('819affbf-3bae-45f8-aafa-5140408f67ca', 'Ndddd', 'nl@dgmail.com', '123456', '0987654321', 'USER', 'ACTIVE', 0.00, '2026-02-26 22:23:27', '2026-02-26 22:23:27', NULL),
('9d77cd14-8b83-4c01-8000-06d47d9f5720', 'sNedsfddsdd', 'nlsdfsdsssddsd@gmail.com', '$2a$10$ijvFG.GWY7OnKk4SEwuIzuh0AhvP9RdfMQda06w1l6ogV7ole/oJu', '0987654321', 'USER', 'ACTIVE', 0.00, '2026-03-02 11:38:31', '2026-03-02 12:50:44', NULL),
('a13a171e-615a-4e4c-b0b3-c5021547d7d2', 'User', 'user4@gmail.com', '$2a$10$AmlIRIMdjt6YrSgeyh/Bo.qNfEMcgjvwjFzYjHEYHEpVJ7Ic1IJh.', '0982826893', 'USER', 'ACTIVE', 0.00, '2026-03-09 20:32:25', '2026-03-09 20:32:25', NULL),
('a25c7f95-ccf7-4015-9dff-37f28642b187', 'sNdddd', 'nls@edgmail.com', '1234456', '0987654321', 'USER', 'ACTIVE', 0.00, '2026-02-27 11:50:11', '2026-02-27 11:50:11', NULL),
('a3214e29-3079-4707-9fe4-24238935c0f1', 'Ndddd', 'nldưa@gmail.com', '123456', '0987654321', 'USER', 'ACTIVE', 0.00, '2026-02-26 22:22:58', '2026-02-26 22:22:58', NULL),
('a4cae35f-1637-41fa-b7cb-e79e8db6af6a', 'Nam', 'nam@gmail.com', '123456', '0987654321', 'USER', 'ACTIVE', 0.00, '2026-02-26 15:38:06', '2026-02-26 15:38:06', NULL),
('a7d82eb1-76e6-4df8-8906-b7308bce2248', 'Nam', 'nassse@gmail.com', '123456', '0987654321', 'USER', 'ACTIVE', 0.00, '2026-02-26 15:52:15', '2026-02-26 15:52:15', NULL),
('aa8299f9-a72e-4e38-8508-67205550ad1b', 'User', 'userư@gmail.com', '$2a$10$aFPk/c54QRCxHEeBt0XPN.l6p7HSjvgV02zqRCyRI0FqI.SlfityC', '0333169776', 'USER', 'ACTIVE', 0.00, '2026-03-04 14:03:15', '2026-03-04 14:03:15', NULL),
('aca1f355-4271-4912-9f94-c3b6cd33d668', 'Nddd', 'nl@gmail.com', '123456', '0987654321', 'USER', 'ACTIVE', 0.00, '2026-02-26 22:23:11', '2026-02-26 22:23:11', NULL),
('b92c881f-49f9-4ff0-a475-b836a555e641', 'User', 'user@gmail.com', '$2a$10$OJibLMQ09tLDv7hdLsr7K.UhDmYU9Syc6/oOScCPunLpMwp2atuUa', '0333169776', 'USER', 'ACTIVE', 0.00, '2026-03-02 13:11:23', '2026-03-02 13:11:23', NULL),
('bb3e97f3-e7c2-4c1c-afc8-8d7527ccff76', 'Nddd', 'nlưa@gmail.com', '123456', '0987654321', 'USER', 'ACTIVE', 0.00, '2026-02-26 22:19:25', '2026-02-28 14:46:15', 'https://res.cloudinary.com/di3cbuwx4/image/upload/v1772264771/sport-booking/avatar/bb3e97f3-e7c2-4c1c-afc8-8d7527ccff76.jpg'),
('cd974c67-66db-4220-a09e-150e9130c7b6', 'Admin', 'admin@gmail.com', '$2a$10$vqFFOyxmaxo2W0GEQ3CiCeOGFjg4viE4tup/rHH54rUZXk2BgAhAS', '0333169776', 'ADMIN', 'ACTIVE', 0.00, '2026-03-02 09:39:13', '2026-03-10 12:57:53', NULL),
('ceea4366-0ff8-4bb4-93bc-f741fa520850', 'sNedfdsdd', 'nlsdfs@gmail.com', '123s4456', '0987654321', 'USER', 'ACTIVE', 0.00, '2026-02-27 11:57:06', '2026-02-27 11:57:06', NULL),
('cfe61b75-783c-4099-94c0-95538758f9a8', 'Nguyen Van B', 'nguyenvanb@gmail.com', '$2a$10$zVHiwQPARE4Op/Q/rnoEounhOcd9uS5RMgDuc75PDlb0g.4wqYyH2', '0909999888', 'USER', 'ACTIVE', 500.00, '2026-02-27 12:05:36', '2026-03-10 12:59:45', NULL),
('d014314c-8252-4cf8-b33b-c1d0f5cb9ea6', 'Nam', 'nasss@gmail.com', '123456', '0987654321', 'USER', 'ACTIVE', 0.00, '2026-02-26 15:47:12', '2026-02-26 15:47:12', NULL),
('d8a9b1ff-bde1-47cf-9303-797e57a05150', 'BUI VAN TUAN', 'user1@gmail.com', '$2a$10$NMmpAyNCo9wvT4eOBsirFu6aqtRvgOfSdphSJMmfxVqyKqhKz0UtO', '0333169776', 'USER', 'ACTIVE', 0.00, '2026-03-04 15:15:11', '2026-03-04 15:15:11', NULL),
('e1d3b276-e87a-4939-91e8-f61e992c4eec', 'sNedfddsdd', 'nlsdfds@gmail.com', '123s4456', '0987654321', 'USER', 'ACTIVE', 0.00, '2026-02-27 11:57:54', '2026-02-27 11:57:54', NULL),
('e2018906-32a3-4583-8daa-8e612da071b7', 'sNdddd', 'nlss@esdgmail.com', '123s4456', '0987654321', 'USER', 'ACTIVE', 0.00, '2026-02-27 11:53:11', '2026-02-27 11:53:11', NULL),
('ee0e4a44-692a-468e-b6cd-cb99ba57ad28', 'sNdfddd', 'nlsfs@esdgmail.com', '123s4456', '0987654321', 'USER', 'ACTIVE', 0.00, '2026-02-27 11:54:44', '2026-02-27 11:54:44', NULL),
('fe247381-6f39-4a37-9088-4a25b9947d5f', 'sNedsfddsdd', 'nlsdfsddds@gmail.com', '123sd4456', '0987654321', 'USER', 'ACTIVE', 0.00, '2026-02-27 12:06:32', '2026-02-27 12:06:32', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `wallet_transactions`
--

CREATE TABLE `wallet_transactions` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `type` enum('ADD','SUBTRACT') NOT NULL,
  `reason` varchar(255) NOT NULL,
  `related_booking_id` char(36) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `admin_logs`
--
ALTER TABLE `admin_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Chỉ mục cho bảng `areas`
--
ALTER TABLE `areas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_areas_city` (`city`),
  ADD KEY `idx_areas_name_city` (`name`,`city`);

--
-- Chỉ mục cho bảng `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `field_id` (`field_id`);

--
-- Chỉ mục cho bảng `booking_options`
--
ALTER TABLE `booking_options`
  ADD PRIMARY KEY (`booking_id`,`option_id`),
  ADD KEY `option_id` (`option_id`);

--
-- Chỉ mục cho bảng `booking_services`
--
ALTER TABLE `booking_services`
  ADD PRIMARY KEY (`booking_id`,`service_id`),
  ADD KEY `service_id` (`service_id`);

--
-- Chỉ mục cho bảng `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`user_id`,`field_id`),
  ADD KEY `field_id` (`field_id`);

--
-- Chỉ mục cho bảng `fields`
--
ALTER TABLE `fields`
  ADD PRIMARY KEY (`id`),
  ADD KEY `field_type_id` (`field_type_id`),
  ADD KEY `area_id` (`area_id`);

--
-- Chỉ mục cho bảng `field_images`
--
ALTER TABLE `field_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `field_id` (`field_id`);

--
-- Chỉ mục cho bảng `field_options`
--
ALTER TABLE `field_options`
  ADD PRIMARY KEY (`id`),
  ADD KEY `field_id` (`field_id`);

--
-- Chỉ mục cho bảng `field_time_blocks`
--
ALTER TABLE `field_time_blocks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `field_id` (`field_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Chỉ mục cho bảng `field_types`
--
ALTER TABLE `field_types`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_id` (`booking_id`);

--
-- Chỉ mục cho bảng `refund_requests`
--
ALTER TABLE `refund_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `payment_id` (`payment_id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Chỉ mục cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_booking_review` (`booking_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `field_id` (`field_id`);

--
-- Chỉ mục cho bảng `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_role` (`role`),
  ADD KEY `idx_users_status` (`status`);

--
-- Chỉ mục cho bảng `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `related_booking_id` (`related_booking_id`);

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `admin_logs`
--
ALTER TABLE `admin_logs`
  ADD CONSTRAINT `admin_logs_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`field_id`) REFERENCES `fields` (`id`);

--
-- Các ràng buộc cho bảng `booking_options`
--
ALTER TABLE `booking_options`
  ADD CONSTRAINT `booking_options_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `booking_options_ibfk_2` FOREIGN KEY (`option_id`) REFERENCES `field_options` (`id`);

--
-- Các ràng buộc cho bảng `booking_services`
--
ALTER TABLE `booking_services`
  ADD CONSTRAINT `booking_services_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `booking_services_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`);

--
-- Các ràng buộc cho bảng `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`field_id`) REFERENCES `fields` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `fields`
--
ALTER TABLE `fields`
  ADD CONSTRAINT `fields_ibfk_1` FOREIGN KEY (`field_type_id`) REFERENCES `field_types` (`id`),
  ADD CONSTRAINT `fields_ibfk_2` FOREIGN KEY (`area_id`) REFERENCES `areas` (`id`);

--
-- Các ràng buộc cho bảng `field_images`
--
ALTER TABLE `field_images`
  ADD CONSTRAINT `field_images_ibfk_1` FOREIGN KEY (`field_id`) REFERENCES `fields` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `field_options`
--
ALTER TABLE `field_options`
  ADD CONSTRAINT `field_options_ibfk_1` FOREIGN KEY (`field_id`) REFERENCES `fields` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `field_time_blocks`
--
ALTER TABLE `field_time_blocks`
  ADD CONSTRAINT `field_time_blocks_ibfk_1` FOREIGN KEY (`field_id`) REFERENCES `fields` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `field_time_blocks_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`);

--
-- Các ràng buộc cho bảng `refund_requests`
--
ALTER TABLE `refund_requests`
  ADD CONSTRAINT `refund_requests_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`),
  ADD CONSTRAINT `refund_requests_ibfk_2` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`),
  ADD CONSTRAINT `refund_requests_ibfk_3` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`field_id`) REFERENCES `fields` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  ADD CONSTRAINT `wallet_transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `wallet_transactions_ibfk_2` FOREIGN KEY (`related_booking_id`) REFERENCES `bookings` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
