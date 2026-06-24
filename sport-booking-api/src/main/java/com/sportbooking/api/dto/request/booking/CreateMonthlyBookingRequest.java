package com.sportbooking.api.dto.request.booking;

import java.math.BigDecimal;
import java.util.List;

import com.sportbooking.api.common.enums.PaymentMethod;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

/** Yêu cầu đặt vé tháng: 1 sân + các khung giờ + các thứ trong tuần, lặp cả tháng. */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateMonthlyBookingRequest {

    @NotBlank(message = "field_id không được để trống")
    String fieldId;

    @NotEmpty(message = "slots không được để trống")
    List<String> slots; // ["19:00", "19:30"]

    @NotEmpty(message = "days_of_week không được để trống")
    List<Integer> daysOfWeek; // ISO: 1=Thứ 2 ... 7=Chủ nhật

    @NotNull(message = "month không được để trống")
    Integer month; // 1-12

    @NotNull(message = "year không được để trống")
    Integer year;

    @NotBlank(message = "customer_name không được để trống")
    String customerName;

    @NotBlank(message = "customer_phone không được để trống")
    String customerPhone;

    String note;

    PaymentMethod paymentMethod;

    /** Tổng tiền cho các khung giờ đã chọn trong MỘT ngày (server nhân theo số buổi tạo). */
    BigDecimal pricePerDay;
}
