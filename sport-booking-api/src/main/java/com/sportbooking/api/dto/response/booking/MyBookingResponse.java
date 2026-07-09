package com.sportbooking.api.dto.response.booking;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

/** Một dòng trong danh sách "sân đã đặt" của người dùng. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MyBookingResponse {
    String id;
    String bookingCode;
    String fieldName;
    String venueName;
    LocalDate bookingDate;
    BigDecimal totalPrice;
    String status;        // trạng thái booking
    String paymentStatus; // trạng thái thanh toán (nếu có)
    boolean refundable;   // có thể yêu cầu hoàn tiền không
    boolean reviewed;     // đã đánh giá đơn này chưa
    Integer reviewRating; // điểm đã đánh giá (nếu có)
    String reviewComment; // nội dung đã đánh giá (nếu có)
}
