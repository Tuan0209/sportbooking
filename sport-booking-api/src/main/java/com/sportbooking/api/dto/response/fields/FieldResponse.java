package com.sportbooking.api.dto.response.fields;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;

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

    // Area info
    String areaId;
    String areaName;

    // FieldType info
    String fieldTypeId;
    String fieldTypeName;

    String address;
    BigDecimal pricePerHour;
    LocalTime openTime;
    LocalTime closeTime;
    BigDecimal latitude;
    BigDecimal longitude;
    FieldStatus status;
    String coverUrl; // anh cover (banner)
    String thumbnailUrl; // anh thumbnail (logo tron)
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}