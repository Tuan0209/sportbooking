package com.sportbooking.api.dto.request.fields;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import jakarta.validation.constraints.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import lombok.Builder;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FieldPriceSlotCreateRequest {

    @NotBlank(message = "field_id không được để trống")
    String fieldId;

    @NotNull(message = "start_time không được để trống")
    LocalTime startTime;

    @NotNull(message = "end_time không được để trống")
    LocalTime endTime;

    @NotNull(message = "price không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá phải lớn hơn 0")
    BigDecimal price;

    LocalDate startDate; // null = không giới hạn ngày bắt đầu

    LocalDate endDate; // null = không giới hạn ngày kết thúc

    // null = áp dụng tất cả các ngày, 0=CN, 1=T2, ..., 6=T7
    @Min(value = 0, message = "day_of_week từ 0 (CN) đến 6 (T7)")
    @Max(value = 6, message = "day_of_week từ 0 (CN) đến 6 (T7)")
    Integer dayOfWeek;

    Integer priority = 0;
}