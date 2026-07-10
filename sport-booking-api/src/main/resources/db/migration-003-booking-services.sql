-- Đợt bổ sung: lưu dịch vụ kèm theo của từng đơn đặt sân

CREATE TABLE IF NOT EXISTS booking_services (
  id CHAR(36) NOT NULL PRIMARY KEY,
  booking_id CHAR(36) NOT NULL,
  service_name VARCHAR(100) NOT NULL,
  unit VARCHAR(50) NULL,
  price DECIMAL(12,2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_booking_services_booking FOREIGN KEY (booking_id)
    REFERENCES bookings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
