-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th6 20, 2026 lúc 10:36 AM
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

--
-- Đang đổ dữ liệu cho bảng `areas`
--

INSERT INTO `areas` (`id`, `name`, `city`, `created_at`) VALUES
('0e880a15-f24d-48d2-850d-dcee642dc48c', 'Đống Đa', 'Hà Nội', '2026-05-07 15:18:36'),
('883a16d2-dee4-49d8-924e-d6028a62d940', 'Nam Từ Liêm', 'Hà Nội', '2026-05-07 17:58:06'),
('b7806001-b5f9-47bf-88a5-391a389f15c5', 'Quận 2', 'Hồ Chí Minh', '2026-03-14 15:58:13'),
('e871e0ab-1ea9-4f04-803a-33ee414eb8f8', 'Quận 3', 'Hồ Chí Minh', '2026-03-15 15:28:26');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bookings`
--

CREATE TABLE `bookings` (
  `id` char(36) NOT NULL,
  `booking_code` varchar(50) DEFAULT NULL,
  `user_id` char(36) NOT NULL,
  `field_id` char(36) NOT NULL,
  `booking_date` date NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `customer_phone` varchar(20) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `total_hours` decimal(5,2) NOT NULL DEFAULT 0.00,
  `total_price` decimal(12,2) NOT NULL,
  `status` enum('PENDING','CONFIRMED','COMPLETED','CANCELED','REJECTED') NOT NULL DEFAULT 'PENDING',
  `note` varchar(500) DEFAULT NULL,
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
  `price` decimal(10,2) NOT NULL
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
-- Cấu trúc bảng cho bảng `booking_slots`
--

CREATE TABLE `booking_slots` (
  `id` char(36) NOT NULL,
  `booking_id` char(36) NOT NULL,
  `field_id` char(36) NOT NULL,
  `booking_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
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
-- Cấu trúc bảng cho bảng `favorite_venue`
--

CREATE TABLE `favorite_venue` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `venue_id` char(36) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fields`
--

CREATE TABLE `fields` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `field_type_id` char(36) NOT NULL,
  `venue_id` char(36) DEFAULT NULL,
  `price_per_hour` decimal(10,2) NOT NULL,
  `open_time` time DEFAULT NULL,
  `close_time` time DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE','MAINTENANCE') NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `slot_interval` int(11) DEFAULT 30
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `fields`
--

INSERT INTO `fields` (`id`, `name`, `field_type_id`, `venue_id`, `price_per_hour`, `open_time`, `close_time`, `status`, `created_at`, `updated_at`, `slot_interval`) VALUES
('22863e37-cd32-4895-b431-fe26a17bd73d', 'Sân 1', '1a26f48d-8d13-4529-abb0-ec61733f6b0b', 'fb644bf1-b056-4385-82bb-929aee07cb84', 2000.00, '06:00:00', '22:00:00', 'ACTIVE', '2026-05-08 21:35:30', '2026-05-08 21:35:30', 30),
('2ebeb284-447e-44d5-900c-4c38697fe453', 'Sân 2', '93997fa7-f576-46cb-a70e-89032a850be7', '1e90289c-41df-11f1-9c32-5cea1d7fb948', 10000.00, '06:00:00', '22:00:00', 'ACTIVE', '2026-05-08 21:32:43', '2026-05-08 21:32:43', 30),
('3fe72ab8-f4fd-4c45-ba9d-6f20b028ca07', 'Sân 1', '1a26f48d-8d13-4529-abb0-ec61733f6b0b', '06497c3b-1890-4a28-bdd9-84e40b4f05cd', 2000.00, '06:00:00', '23:00:00', 'INACTIVE', '2026-05-07 16:47:06', '2026-05-08 17:57:39', 60),
('5438f875-1a3b-4720-bac7-b72a2f5765b8', 'Sân 2', '1a26f48d-8d13-4529-abb0-ec61733f6b0b', '1e9029f7-41df-11f1-9c32-5cea1d7fb948', 20000.00, '06:00:00', '22:00:00', 'ACTIVE', '2026-05-08 21:34:49', '2026-05-08 21:34:49', 30),
('562ae128-530c-4151-b71f-6ea58f1f0a87', 'Sân 2', '1a26f48d-8d13-4529-abb0-ec61733f6b0b', '06497c3b-1890-4a28-bdd9-84e40b4f05cd', 20000.00, '06:00:00', '22:00:00', 'ACTIVE', '2026-05-07 17:16:54', '2026-05-08 17:57:51', 30),
('7b6e0482-5e95-4272-ac8c-2acf1c197e33', 'Sân 3', '1a26f48d-8d13-4529-abb0-ec61733f6b0b', '06497c3b-1890-4a28-bdd9-84e40b4f05cd', 10000.00, '06:00:00', '22:00:00', 'ACTIVE', '2026-05-08 15:08:38', '2026-05-08 17:57:59', 30),
('86c63900-8b78-4ff1-afd3-9d1b71423b7b', 'Sân 1', '1a26f48d-8d13-4529-abb0-ec61733f6b0b', '1e9029f7-41df-11f1-9c32-5cea1d7fb948', 100000.00, '06:00:00', '22:00:00', 'ACTIVE', '2026-05-08 21:34:34', '2026-05-08 21:34:34', 30),
('9058cec4-29fa-4027-aa90-45d168beda9e', 'Sân 4', '1a26f48d-8d13-4529-abb0-ec61733f6b0b', '06497c3b-1890-4a28-bdd9-84e40b4f05cd', 10000.00, '06:00:00', '22:00:00', 'ACTIVE', '2026-05-08 15:14:00', '2026-05-08 17:59:50', 60),
('a5e0275d-61b0-49c7-9102-e0264b84be6d', 'Sân 1', '93997fa7-f576-46cb-a70e-89032a850be7', '1e902ad6-41df-11f1-9c32-5cea1d7fb948', 20000.00, '01:00:00', '22:00:00', 'ACTIVE', '2026-05-07 17:18:43', '2026-05-08 16:25:41', 60),
('af463a14-2e0b-4cc0-ac08-861d82551428', 'Sân số 3', '1a26f48d-8d13-4529-abb0-ec61733f6b0b', '06497c3b-1890-4a28-bdd9-84e40b4f05cd', 10000.00, '06:00:00', '22:00:00', 'ACTIVE', '2026-05-08 15:01:35', '2026-05-08 18:04:26', 30),
('e05b399c-636a-4e79-9532-e313af43f379', 'Sân 1', '93997fa7-f576-46cb-a70e-89032a850be7', '1e90289c-41df-11f1-9c32-5cea1d7fb948', 20000.00, '06:00:00', '22:00:00', 'ACTIVE', '2026-05-08 21:32:24', '2026-05-08 21:32:24', 30),
('ef6e858a-f493-45f4-8e0f-6d976a6ed413', 'Sân 3', '1a26f48d-8d13-4529-abb0-ec61733f6b0b', 'fb644bf1-b056-4385-82bb-929aee07cb84', 20000.00, '06:00:00', '22:00:00', 'ACTIVE', '2026-05-08 21:35:42', '2026-05-08 21:35:46', 30);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `field_options`
--

CREATE TABLE `field_options` (
  `id` char(36) NOT NULL,
  `field_id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price_per_hour` decimal(10,2) NOT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `field_price_slots`
--

CREATE TABLE `field_price_slots` (
  `id` char(36) NOT NULL,
  `field_id` char(36) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `day_of_week` int(11) DEFAULT NULL,
  `priority` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `field_price_slots`
--

INSERT INTO `field_price_slots` (`id`, `field_id`, `start_time`, `end_time`, `price`, `created_at`, `start_date`, `end_date`, `day_of_week`, `priority`) VALUES
('0ca76fd5-bce7-4eac-9356-9ab5ca6aa48e', '562ae128-530c-4151-b71f-6ea58f1f0a87', '17:00:00', '22:00:00', 200000.00, '2026-05-08 16:10:37', '2026-05-25', '2026-05-26', NULL, 6),
('58b38e23-a590-4484-879d-d37d12f193bf', '3fe72ab8-f4fd-4c45-ba9d-6f20b028ca07', '17:00:00', '22:00:00', 200000.00, '2026-05-07 17:52:00', NULL, NULL, 0, 11),
('6567292f-78aa-40fa-ba70-e95253f1a1de', '3fe72ab8-f4fd-4c45-ba9d-6f20b028ca07', '17:00:00', '19:00:00', 150000.00, '2026-05-07 17:29:27', NULL, NULL, 6, 10),
('b8941f56-3d79-4a13-900e-73c6ea972e80', '7b6e0482-5e95-4272-ac8c-2acf1c197e33', '17:00:00', '22:00:00', 30000.00, '2026-05-08 16:07:58', NULL, NULL, NULL, 1);

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

CREATE TABLE `field_types` (
  `id` char(36) NOT NULL,
  `name` varchar(50) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `sport_type_id` char(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `field_types`
--

INSERT INTO `field_types` (`id`, `name`, `created_at`, `sport_type_id`) VALUES
('1a26f48d-8d13-4529-abb0-ec61733f6b0b', 'Sân 5', '2026-03-15 15:58:19', 'football'),
('93997fa7-f576-46cb-a70e-89032a850be7', 'Sân đôi', '2026-03-15 16:03:12', 'football'),
('a2cf8858-7b06-4473-bbd2-6f4f85e584b4', 'Sân 9', '2026-03-14 15:46:04', 'football'),
('b82f70fd-5438-4787-af1f-d6649910bfff', 'Sân 11', '2026-03-15 15:29:50', 'football'),
('fc35b076-e68a-4037-bea8-45b54ae6515d', 'Sân đơn', '2026-03-15 16:16:19', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `maintenance_schedules`
--

CREATE TABLE `maintenance_schedules` (
  `id` char(36) NOT NULL,
  `field_id` char(36) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payments`
--

CREATE TABLE `payments` (
  `id` char(36) NOT NULL,
  `booking_id` char(36) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `method` enum('PAYOS','BANK_QR','COIN') NOT NULL,
  `status` enum('PENDING','PAID','FAILED','EXPIRED','REFUNDED') NOT NULL DEFAULT 'PENDING',
  `transaction_code` varchar(100) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `expired_at` datetime DEFAULT NULL,
  `paid_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payment_proofs`
--

CREATE TABLE `payment_proofs` (
  `id` char(36) NOT NULL,
  `payment_id` char(36) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `uploaded_at` datetime DEFAULT current_timestamp()
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
-- Cấu trúc bảng cho bảng `sport_types`
--

CREATE TABLE `sport_types` (
  `id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `sport_types`
--

INSERT INTO `sport_types` (`id`, `name`) VALUES
('football', 'Bóng đá'),
('badminton', 'Cầu lông');

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
-- Cấu trúc bảng cho bảng `venues`
--

CREATE TABLE `venues` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `area_id` char(36) NOT NULL,
  `latitude` decimal(10,6) DEFAULT NULL,
  `longitude` decimal(10,6) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `open_time` time NOT NULL DEFAULT '06:00:00',
  `close_time` time NOT NULL DEFAULT '23:00:00',
  `status` varchar(20) NOT NULL DEFAULT 'ACTIVE',
  `rating` decimal(2,1) DEFAULT 0.0,
  `total_reviews` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `venues`
--

INSERT INTO `venues` (`id`, `name`, `address`, `area_id`, `latitude`, `longitude`, `created_at`, `open_time`, `close_time`, `status`, `rating`, `total_reviews`) VALUES
('06497c3b-1890-4a28-bdd9-84e40b4f05cd', 'Sân bóng ABC', '123 Nguyễn Trãi, Hà Nội', 'b7806001-b5f9-47bf-88a5-391a389f15c5', 21.028500, 105.854200, '2026-05-04 15:08:36', '01:00:00', '23:00:00', 'ACTIVE', 0.0, 0),
('14581089-35f0-4b5a-9467-5b73cce527b3', 'Sân Bóng Đồng tâm', '46 Ngõ 205 Giải Phóng, Đồng Tâm, Hai Bà Trưng, Hà Nội', 'b7806001-b5f9-47bf-88a5-391a389f15c5', 21.000963, 105.842225, '2026-05-07 10:40:41', '06:00:00', '22:00:00', 'MAINTENANCE', 0.0, 0),
('1e90289c-41df-11f1-9c32-5cea1d7fb948', 'Sân Bóng Đá Mini A1', '123 Nguyễn Văn Linh, Quận 7', 'b7806001-b5f9-47bf-88a5-391a389f15c5', 10.732657, 106.698150, '2026-04-27 09:16:37', '06:00:00', '23:00:00', 'ACTIVE', 0.0, 0),
('1e9029f7-41df-11f1-9c32-5cea1d7fb948', 'Sân Pickleball', '2 Tràng An, Phố, Hoa Lư, Ninh Bình', 'b7806001-b5f9-47bf-88a5-391a389f15c5', 20.264534, 105.965639, '2026-04-27 09:16:37', '06:00:00', '23:00:00', 'ACTIVE', 0.0, 0),
('1e902ad6-41df-11f1-9c32-5cea1d7fb948', 'Sân bóng rổ', '341/19 Xuân Phương, Xuân Phương, Nam Từ Liêm, Hà Nội', '883a16d2-dee4-49d8-924e-d6028a62d940', 21.031403, 105.740290, '2026-04-27 09:16:37', '01:00:00', '23:00:00', 'ACTIVE', 0.0, 0),
('fb644bf1-b056-4385-82bb-929aee07cb84', 'Sân bóng Hoàng Cầu', 'Đống Đa, Hà Nội', '0e880a15-f24d-48d2-850d-dcee642dc48c', 21.023500, 105.829300, '2026-04-27 15:51:17', '06:00:00', '23:00:00', 'ACTIVE', 0.0, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `venue_images`
--

CREATE TABLE `venue_images` (
  `id` char(36) NOT NULL,
  `venue_id` char(36) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `type` enum('cover','gallery','thumbnail') DEFAULT 'gallery',
  `is_primary` tinyint(1) DEFAULT 0,
  `sort_order` int(11) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `venue_images`
--

INSERT INTO `venue_images` (`id`, `venue_id`, `image_url`, `type`, `is_primary`, `sort_order`, `created_at`) VALUES
('0825c2f6-c932-4ef9-93a3-e328f9a13dd4', '1e9029f7-41df-11f1-9c32-5cea1d7fb948', 'https://res.cloudinary.com/di3cbuwx4/image/upload/v1776851513/sport-booking/fields/86104b5e-0de8-4017-8a01-e76f4515484b_thumbnail_1776851510812.jpg', 'thumbnail', 1, 0, '2026-04-22 16:51:53'),
('09efefd3-7745-41b4-8de9-19e4e3d76cea', 'fb644bf1-b056-4385-82bb-929aee07cb84', 'https://res.cloudinary.com/di3cbuwx4/image/upload/v1778141796/sport-booking/fields/fb644bf1-b056-4385-82bb-929aee07cb84_thumbnail_1778141795112.jpg', 'thumbnail', 1, 0, '2026-05-07 15:16:37'),
('140e7345-6b58-436c-a919-feb7a48780c2', '1e90289c-41df-11f1-9c32-5cea1d7fb948', 'https://res.cloudinary.com/di3cbuwx4/image/upload/v1778141653/sport-booking/fields/1e90289c-41df-11f1-9c32-5cea1d7fb948_thumbnail_1778141651226.jpg', 'thumbnail', 1, 0, '2026-05-07 15:14:13'),
('15dba0fb-6aac-48d6-9cd6-e49bf879092d', '06497c3b-1890-4a28-bdd9-84e40b4f05cd', 'https://res.cloudinary.com/di3cbuwx4/image/upload/v1777889888/sport-booking/fields/06497c3b-1890-4a28-bdd9-84e40b4f05cd_gallery_1777889886083_0.jpg', 'gallery', 0, 0, '2026-05-04 17:18:10'),
('186a28eb-f11c-40a3-9090-cc85507066e6', '14581089-35f0-4b5a-9467-5b73cce527b3', 'https://res.cloudinary.com/di3cbuwx4/image/upload/v1778125431/sport-booking/fields/14581089-35f0-4b5a-9467-5b73cce527b3_cover_1778125428719.jpg', 'cover', 1, 0, '2026-05-07 10:43:52'),
('31f04fb4-d712-43f4-8718-8bbed79fce9a', '14581089-35f0-4b5a-9467-5b73cce527b3', 'https://res.cloudinary.com/di3cbuwx4/image/upload/v1778125434/sport-booking/fields/14581089-35f0-4b5a-9467-5b73cce527b3_thumbnail_1778125434316.jpg', 'thumbnail', 1, 0, '2026-05-07 10:43:55'),
('36cb4185-2ed8-4b30-a4d3-3b3f8586484f', '06497c3b-1890-4a28-bdd9-84e40b4f05cd', 'https://res.cloudinary.com/di3cbuwx4/image/upload/v1777889890/sport-booking/fields/06497c3b-1890-4a28-bdd9-84e40b4f05cd_gallery_1777889888499_1.jpg', 'gallery', 0, 1, '2026-05-04 17:18:10'),
('37d53c0a-05a1-4b96-abb0-75986ac6c17f', '06497c3b-1890-4a28-bdd9-84e40b4f05cd', 'https://res.cloudinary.com/di3cbuwx4/image/upload/v1777890560/sport-booking/fields/06497c3b-1890-4a28-bdd9-84e40b4f05cd_thumbnail_1777890558152.jpg', 'thumbnail', 1, 0, '2026-05-04 17:29:20'),
('3ce8d240-29e2-49a6-bca8-9aa4a05649bb', '06497c3b-1890-4a28-bdd9-84e40b4f05cd', 'https://res.cloudinary.com/di3cbuwx4/image/upload/v1777890698/sport-booking/fields/06497c3b-1890-4a28-bdd9-84e40b4f05cd_gallery_1777890696292_0.jpg', 'gallery', 0, 2, '2026-05-04 17:31:41'),
('475b6575-8ba9-49bc-86da-05a1dbe5fd40', '1e9029f7-41df-11f1-9c32-5cea1d7fb948', 'https://res.cloudinary.com/di3cbuwx4/image/upload/v1776851517/sport-booking/fields/86104b5e-0de8-4017-8a01-e76f4515484b_cover_1776851514895.jpg', 'cover', 1, 0, '2026-04-22 16:51:56'),
('77f098c0-25ac-464c-a9b1-f19c77086e9c', '1e902ad6-41df-11f1-9c32-5cea1d7fb948', 'https://res.cloudinary.com/di3cbuwx4/image/upload/v1776851423/sport-booking/fields/8a8b3bc1-34bc-420e-9ab4-afac7176fa24_cover_1776851420983.jpg', 'cover', 1, 0, '2026-04-22 16:50:22'),
('859385e0-b13e-4f09-bd39-f6a80a08aa32', '06497c3b-1890-4a28-bdd9-84e40b4f05cd', 'https://res.cloudinary.com/di3cbuwx4/image/upload/v1777890701/sport-booking/fields/06497c3b-1890-4a28-bdd9-84e40b4f05cd_gallery_1777890698961_1.jpg', 'gallery', 0, 3, '2026-05-04 17:31:41'),
('ba1baa12-e3c4-44bb-99fe-2915a0727acd', '06497c3b-1890-4a28-bdd9-84e40b4f05cd', 'https://res.cloudinary.com/di3cbuwx4/image/upload/v1777890109/sport-booking/fields/06497c3b-1890-4a28-bdd9-84e40b4f05cd_cover_1777890106796.jpg', 'cover', 1, 0, '2026-05-04 17:21:50'),
('cb146300-225e-47f6-9268-332e9f503314', '1e90289c-41df-11f1-9c32-5cea1d7fb948', 'https://res.cloudinary.com/di3cbuwx4/image/upload/v1778141234/sport-booking/fields/1e90289c-41df-11f1-9c32-5cea1d7fb948_cover_1778141232787.jpg', 'cover', 1, 0, '2026-05-07 15:07:15'),
('dc942e99-29a4-4691-aa76-9d4e5204bf67', 'fb644bf1-b056-4385-82bb-929aee07cb84', 'https://res.cloudinary.com/di3cbuwx4/image/upload/v1778171943/sport-booking/fields/fb644bf1-b056-4385-82bb-929aee07cb84_cover_1778171938916.jpg', 'cover', 1, 0, '2026-05-07 23:39:03'),
('ffab819b-1a2b-44bb-8a8b-3ba9d9d5816e', '1e902ad6-41df-11f1-9c32-5cea1d7fb948', 'https://res.cloudinary.com/di3cbuwx4/image/upload/v1776851419/sport-booking/fields/8a8b3bc1-34bc-420e-9ab4-afac7176fa24_thumbnail_1776851417301.jpg', 'thumbnail', 1, 0, '2026-04-22 16:50:18');

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
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `balance_after` decimal(12,2) DEFAULT NULL
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
  ADD UNIQUE KEY `booking_code` (`booking_code`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_booking_user` (`user_id`),
  ADD KEY `idx_booking_status` (`status`),
  ADD KEY `idx_booking_field_date` (`field_id`,`booking_date`);

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
-- Chỉ mục cho bảng `booking_slots`
--
ALTER TABLE `booking_slots`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_field_slot` (`field_id`,`booking_date`,`start_time`),
  ADD KEY `idx_booking_slot_booking` (`booking_id`),
  ADD KEY `idx_booking_slot_field` (`field_id`,`booking_date`);

--
-- Chỉ mục cho bảng `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`user_id`,`field_id`),
  ADD KEY `field_id` (`field_id`);

--
-- Chỉ mục cho bảng `favorite_venue`
--
ALTER TABLE `favorite_venue`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_venue` (`user_id`,`venue_id`),
  ADD KEY `fk_favorite_venue` (`venue_id`);

--
-- Chỉ mục cho bảng `fields`
--
ALTER TABLE `fields`
  ADD PRIMARY KEY (`id`),
  ADD KEY `field_type_id` (`field_type_id`),
  ADD KEY `fields_ibfk_venue` (`venue_id`);

--
-- Chỉ mục cho bảng `field_options`
--
ALTER TABLE `field_options`
  ADD PRIMARY KEY (`id`),
  ADD KEY `field_id` (`field_id`);

--
-- Chỉ mục cho bảng `field_price_slots`
--
ALTER TABLE `field_price_slots`
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
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_fieldtype_sport` (`sport_type_id`);

--
-- Chỉ mục cho bảng `maintenance_schedules`
--
ALTER TABLE `maintenance_schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `field_id` (`field_id`);

--
-- Chỉ mục cho bảng `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_id` (`booking_id`);

--
-- Chỉ mục cho bảng `payment_proofs`
--
ALTER TABLE `payment_proofs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_payment_proof` (`payment_id`);

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
-- Chỉ mục cho bảng `sport_types`
--
ALTER TABLE `sport_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_role` (`role`),
  ADD KEY `idx_users_status` (`status`);

--
-- Chỉ mục cho bảng `venues`
--
ALTER TABLE `venues`
  ADD PRIMARY KEY (`id`),
  ADD KEY `area_id` (`area_id`);

--
-- Chỉ mục cho bảng `venue_images`
--
ALTER TABLE `venue_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `field_id` (`venue_id`);

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
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`field_id`) REFERENCES `fields` (`id`),
  ADD CONSTRAINT `fk_booking_field` FOREIGN KEY (`field_id`) REFERENCES `fields` (`id`),
  ADD CONSTRAINT `fk_booking_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

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
-- Các ràng buộc cho bảng `booking_slots`
--
ALTER TABLE `booking_slots`
  ADD CONSTRAINT `fk_booking_slot_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_booking_slot_field` FOREIGN KEY (`field_id`) REFERENCES `fields` (`id`);

--
-- Các ràng buộc cho bảng `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`field_id`) REFERENCES `fields` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `favorite_venue`
--
ALTER TABLE `favorite_venue`
  ADD CONSTRAINT `fk_favorite_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_favorite_venue` FOREIGN KEY (`venue_id`) REFERENCES `venues` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `fields`
--
ALTER TABLE `fields`
  ADD CONSTRAINT `fields_ibfk_1` FOREIGN KEY (`field_type_id`) REFERENCES `field_types` (`id`),
  ADD CONSTRAINT `fields_ibfk_venue` FOREIGN KEY (`venue_id`) REFERENCES `venues` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `field_options`
--
ALTER TABLE `field_options`
  ADD CONSTRAINT `field_options_ibfk_1` FOREIGN KEY (`field_id`) REFERENCES `fields` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `field_price_slots`
--
ALTER TABLE `field_price_slots`
  ADD CONSTRAINT `fps_ibfk_1` FOREIGN KEY (`field_id`) REFERENCES `fields` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `field_time_blocks`
--
ALTER TABLE `field_time_blocks`
  ADD CONSTRAINT `field_time_blocks_ibfk_1` FOREIGN KEY (`field_id`) REFERENCES `fields` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `field_time_blocks_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `field_types`
--
ALTER TABLE `field_types`
  ADD CONSTRAINT `fk_fieldtype_sport` FOREIGN KEY (`sport_type_id`) REFERENCES `sport_types` (`id`);

--
-- Các ràng buộc cho bảng `maintenance_schedules`
--
ALTER TABLE `maintenance_schedules`
  ADD CONSTRAINT `maintenance_schedules_ibfk_1` FOREIGN KEY (`field_id`) REFERENCES `fields` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`);

--
-- Các ràng buộc cho bảng `payment_proofs`
--
ALTER TABLE `payment_proofs`
  ADD CONSTRAINT `fk_payment_proof` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`);

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
-- Các ràng buộc cho bảng `venues`
--
ALTER TABLE `venues`
  ADD CONSTRAINT `venues_ibfk_1` FOREIGN KEY (`area_id`) REFERENCES `areas` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `venue_images`
--
ALTER TABLE `venue_images`
  ADD CONSTRAINT `fk_venue_images` FOREIGN KEY (`venue_id`) REFERENCES `venues` (`id`) ON DELETE CASCADE;

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
