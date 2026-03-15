package com.sportbooking.api.dto.request.fields;

import java.math.BigDecimal;
import java.time.LocalTime;

import com.sportbooking.api.common.enums.FieldStatus;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FieldUpdateRequest {

    String name;
    String areaId;
    String fieldTypeId;
    String address;
    BigDecimal pricePerHour;
    LocalTime openTime;
    LocalTime closeTime;
    BigDecimal latitude;
    BigDecimal longitude;
    FieldStatus status;
}