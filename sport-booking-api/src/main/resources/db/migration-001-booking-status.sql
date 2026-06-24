-- Đợt 3: mở rộng enum trạng thái booking cho khớp với BookingStatus (Java)
-- Bổ sung PENDING_PAYMENT, PENDING_CONFIRMATION (phục vụ luồng thanh toán thủ công/PayOS)
ALTER TABLE bookings
  MODIFY status enum(
    'PENDING_PAYMENT',
    'PENDING_CONFIRMATION',
    'CONFIRMED',
    'COMPLETED',
    'CANCELED',
    'REJECTED'
  ) NOT NULL DEFAULT 'PENDING_PAYMENT';
