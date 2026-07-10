package com.sportbooking.api.dto.response.booking;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

/** Chi tiết đầy đủ 1 đơn đặt sân: sân, khung giờ, dịch vụ kèm theo. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingDetailResponse {
    String id;
    String bookingCode;
    String venueName;
    String venueAddress;
    String fieldName;
    String fieldTypeName;
    LocalDate bookingDate;
    LocalTime startTime;
    LocalTime endTime;
    List<String> slots;
    String customerName;
    String customerPhone;
    String note;
    BigDecimal totalHours;
    BigDecimal totalPrice;
    String status;
    String paymentStatus;
    String paymentMethod;
    List<BookingServiceLine> services;
    BigDecimal servicesTotal;
}
