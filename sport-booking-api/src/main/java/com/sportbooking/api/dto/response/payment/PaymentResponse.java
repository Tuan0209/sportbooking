package com.sportbooking.api.dto.response.payment;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

/** Thông tin thanh toán để hiển thị QR + trạng thái cho người dùng. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentResponse {
    String paymentId;
    String bookingId;
    String bookingCode;
    BigDecimal amount;
    String method;
    String status;
    LocalDateTime expiredAt;

    // Thông tin chuyển khoản / QR
    String qrUrl;
    String bankName;
    String accountNo;
    String accountName;
    String transferContent;

    // Ảnh bill đã upload (nếu có)
    String proofImageUrl;
    String checkoutUrl;
}
