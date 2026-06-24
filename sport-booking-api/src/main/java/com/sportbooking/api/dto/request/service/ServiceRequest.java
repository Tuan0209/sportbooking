package com.sportbooking.api.dto.request.service;

import java.math.BigDecimal;

import com.sportbooking.api.common.enums.Status;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceRequest {
    String name;
    BigDecimal price;
    String unit;
    Status status;
}
