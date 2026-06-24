package com.sportbooking.api.dto.response.payment;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

/** Một dòng thanh toán trong màn quản trị duyệt thanh toán. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminPaymentResponse {
    String paymentId;
    String bookingId;
    String bookingCode;
    String customerName;
    String customerPhone;
    String fieldName;
    String venueName;
    LocalDate bookingDate;
    BigDecimal amount;
    String method;
    String status;        // trạng thái thanh toán
    String bookingStatus; // trạng thái booking
    LocalDateTime createdAt;
    String proofImageUrl;
}
