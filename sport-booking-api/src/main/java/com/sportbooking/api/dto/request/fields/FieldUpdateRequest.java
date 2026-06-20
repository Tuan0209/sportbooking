package com.sportbooking.api.dto.request.fields;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.List;
import com.sportbooking.api.common.enums.FieldStatus;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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
    String venueId;
    String fieldTypeId;
    String address;
    BigDecimal pricePerHour;
    LocalTime openTime;
    LocalTime closeTime;
    BigDecimal latitude;
    BigDecimal longitude;
    FieldStatus status;
    List<FieldPriceSlotCreateRequest> priceSlots;
    @Min(value = 5, message = "slotInterval tối thiểu 5 phút")
    @Max(value = 180, message = "slotInterval tối đa 180 phút")
    Integer slotInterval;
}