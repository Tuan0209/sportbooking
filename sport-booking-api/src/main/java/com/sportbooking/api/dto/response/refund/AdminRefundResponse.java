package com.sportbooking.api.dto.response.refund;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminRefundResponse {
    String refundId;
    String bookingId;
    String bookingCode;
    String customerName;
    String customerPhone;
    String fieldName;
    BigDecimal refundAmount;
    String refundMethod;
    String bankName;
    String bankAccount;
    String bankAccountName;
    String status;
    String transactionCode;
    String proofImage;
    LocalDateTime createdAt;
    LocalDateTime completedAt;
}
