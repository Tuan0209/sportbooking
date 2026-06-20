package com.sportbooking.api.dto.response.fields;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

// response chi tiet gia tung khung gio
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PriceResponse {

    BigDecimal totalPrice;
    List<PriceBreakdownItem> breakdown;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class PriceBreakdownItem {
        LocalTime from;
        LocalTime to;
        BigDecimal price; // gia theo gio
        BigDecimal subtotal; // price * so gio cua segment nay
        String slotId; // null neu la fallback price
    }
}