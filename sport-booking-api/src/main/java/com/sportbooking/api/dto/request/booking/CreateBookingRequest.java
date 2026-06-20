package com.sportbooking.api.dto.request.booking;

import com.sportbooking.api.common.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateBookingRequest {

    @NotBlank(message = "field_id không được để trống")
    String fieldId;

    @NotBlank(message = "booking_date không được để trống")
    String bookingDate;

    @NotEmpty(message = "slots không được để trống")
    List<String> slots;

    @NotNull(message = "payment_method không được để trống")
    PaymentMethod paymentMethod;

    @NotBlank(message = "customer_name không được để trống")
    String customerName;

    @NotBlank(message = "customer_phone không được để trống")
    String customerPhone;

    String note;

    @NotNull(message = "total_price không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "total_price phải lớn hơn 0")
    BigDecimal totalPrice;
}
