package com.sportbooking.api.dto.request.booking;

import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.List;

import com.sportbooking.api.common.enums.PaymentMethod;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateBookingRequest {

    String fieldId;

    String bookingDate;

    List<String> slots;

    String customerName;

    String customerPhone;

    String note;

    BigDecimal totalPrice;

    PaymentMethod paymentMethod;
}