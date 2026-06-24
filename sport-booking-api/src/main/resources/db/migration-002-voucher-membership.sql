-- Đợt 7 & 8: bảng voucher và gói thành viên

CREATE TABLE IF NOT EXISTS vouchers (
  id CHAR(36) NOT NULL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255) NULL,
  discount_type ENUM('PERCENT','AMOUNT') NOT NULL,
  discount_value DECIMAL(12,2) NOT NULL,
  min_order DECIMAL(12,2) NOT NULL DEFAULT 0,
  max_discount DECIMAL(12,2) NULL,
  usage_limit INT NULL,
  used_count INT NOT NULL DEFAULT 0,
  start_date DATETIME NULL,
  end_date DATETIME NULL,
  status ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS membership_plans (
  id CHAR(36) NOT NULL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(500) NULL,
  price DECIMAL(12,2) NOT NULL,
  duration_days INT NOT NULL,
  discount_percent INT NOT NULL DEFAULT 0,
  benefits TEXT NULL,
  status ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_memberships (
  id CHAR(36) NOT NULL PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  plan_id CHAR(36) NOT NULL,
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  status ENUM('ACTIVE','EXPIRED','CANCELED') NOT NULL DEFAULT 'ACTIVE',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dữ liệu mẫu gói thành viên
INSERT INTO membership_plans (id, name, description, price, duration_days, discount_percent, benefits)
SELECT * FROM (
  SELECT UUID() AS id, 'Hội viên Bạc' AS name, 'Ưu đãi cơ bản cho người chơi thường xuyên' AS description,
         99000 AS price, 30 AS duration_days, 5 AS discount_percent,
         'Giảm 5% mỗi lần đặt sân|Ưu tiên giữ chỗ' AS benefits
) t WHERE NOT EXISTS (SELECT 1 FROM membership_plans);

INSERT INTO membership_plans (id, name, description, price, duration_days, discount_percent, benefits)
SELECT UUID(), 'Hội viên Vàng', 'Ưu đãi nâng cao, tiết kiệm hơn', 249000, 90, 10,
       'Giảm 10% mỗi lần đặt sân|Ưu tiên giữ chỗ|Tặng 1 buổi miễn phí'
WHERE (SELECT COUNT(*) FROM membership_plans) < 2;

-- Voucher mẫu
INSERT INTO vouchers (id, code, description, discount_type, discount_value, min_order, max_discount, usage_limit)
SELECT UUID(), 'WELCOME10', 'Giảm 10% cho đơn đầu tiên', 'PERCENT', 10, 0, 50000, 100
WHERE NOT EXISTS (SELECT 1 FROM vouchers WHERE code='WELCOME10');

INSERT INTO vouchers (id, code, description, discount_type, discount_value, min_order)
SELECT UUID(), 'GIAM50K', 'Giảm 50.000đ cho đơn từ 200.000đ', 'AMOUNT', 50000, 200000
WHERE NOT EXISTS (SELECT 1 FROM vouchers WHERE code='GIAM50K');
