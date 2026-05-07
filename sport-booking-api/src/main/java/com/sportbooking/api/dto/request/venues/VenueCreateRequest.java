package com.sportbooking.api.dto.request.venues;

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
public class VenueCreateRequest {

    @NotBlank
    String name;

    @NotBlank
    String address;

    @NotBlank
    String areaId;
    @NotNull
    LocalTime openTime;

    @NotNull
    LocalTime closeTime;

    BigDecimal latitude;
    BigDecimal longitude;
}
