package com.sportbooking.api.dto.response.booking;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingResponse {

    String id;

    String bookingCode;

    String fieldName;

    LocalDate bookingDate;

    List<String> slots;

    BigDecimal totalPrice;

    String status;

    String paymentId; // có khi thanh toán BANK_QR / PAYOS
}