package com.sportbooking.api.dto.response.booking;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

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
public class AdminBookingResponse {
    String id;
    String bookingCode;
    String customerName;
    String customerPhone;
    String fieldName;
    String venueName;
    LocalDate bookingDate;
    LocalTime startTime;
    LocalTime endTime;
    BigDecimal totalPrice;
    String status;
    LocalDateTime createdAt;
}
