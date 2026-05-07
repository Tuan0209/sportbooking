package com.sportbooking.api.dto.request.fields;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FieldCreateRequest {

    @NotBlank(message = "Tên sân không được để trống")
    String name;

    // @NotBlank(message = "area_id không được để trống")
    // String areaId;

    @NotBlank
    String venueId;

    @NotBlank(message = "field_type_id không được để trống")
    String fieldTypeId;

    // @NotBlank(message = "Địa chỉ không được để trống")
    // String address;

    @NotNull(message = "Giá thuê không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá thuê phải lớn hơn 0")
    BigDecimal pricePerHour;

    @NotNull(message = "Giờ mở cửa không được để trống")
    LocalTime openTime;

    @NotNull(message = "Giờ đóng cửa không được để trống")
    LocalTime closeTime;

    BigDecimal latitude;
    BigDecimal longitude;

    List<FieldPriceSlotCreateRequest> priceSlots;
    @Column(name = "slot_interval")

    Integer slotInterval = 30; // phút (30, 60, 15...)
}