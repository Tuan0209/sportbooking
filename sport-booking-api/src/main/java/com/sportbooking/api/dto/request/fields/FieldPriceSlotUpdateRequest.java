package com.sportbooking.api.dto.request.fields;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FieldPriceSlotUpdateRequest {

    LocalTime startTime;

    LocalTime endTime;

    @DecimalMin(value = "0.0", inclusive = false, message = "Giá phải lớn hơn 0")
    BigDecimal price;

    LocalDate startDate;

    LocalDate endDate;

    @Min(value = 0)
    @Max(value = 6)
    Integer dayOfWeek;

    Integer priority;
}