package com.sportbooking.api.dto.request.venues;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.math.BigDecimal;
import java.time.LocalTime;

import com.sportbooking.api.common.enums.VenueStatus;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VenueUpdateRequest {
    String name;
    String address;
    String areaId;
    VenueStatus status;

    LocalTime openTime;

    LocalTime closeTime;
    BigDecimal latitude;
    BigDecimal longitude;
}
