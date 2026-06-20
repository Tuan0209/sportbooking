package com.sportbooking.api.dto.response.fields;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FieldPriceSlotResponse {

    String id;
    String fieldId;
    String fieldName;
    LocalTime startTime;
    LocalTime endTime;
    BigDecimal price;
    LocalDate startDate;
    LocalDate endDate;
    Integer dayOfWeek; // null = tat ca ngay
    Integer priority;
    LocalDateTime createdAt;
}