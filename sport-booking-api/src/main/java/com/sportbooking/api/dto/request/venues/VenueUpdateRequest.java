package com.sportbooking.api.dto.request.venues;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.math.BigDecimal;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VenueUpdateRequest {
    String name;
    String address;
    String areaId;

    LocalTime openTime;

    LocalTime closeTime;
    BigDecimal latitude;
    BigDecimal longitude;
}
