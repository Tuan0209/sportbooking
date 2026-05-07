package com.sportbooking.api.dto.response.fields;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import com.sportbooking.api.common.enums.FieldStatus;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FieldResponse {

    String id;
    String name;

    String venueId;
    String venueName;
    String sportTypeId;
    String sportTypeName;
    String areaId;
    String areaName;

    // FieldType info
    String fieldTypeId;
    String fieldTypeName;

    BigDecimal pricePerHour;
    LocalTime openTime;
    LocalTime closeTime;
    FieldStatus status;
    List<FieldPriceSlotResponse> priceSlots;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}