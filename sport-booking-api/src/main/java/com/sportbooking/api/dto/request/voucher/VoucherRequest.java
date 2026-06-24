package com.sportbooking.api.dto.request.voucher;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.sportbooking.api.common.enums.DiscountType;
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
public class VoucherRequest {
    String code;
    String description;
    DiscountType discountType;
    BigDecimal discountValue;
    BigDecimal minOrder;
    BigDecimal maxDiscount;
    Integer usageLimit;
    LocalDateTime startDate;
    LocalDateTime endDate;
    Status status;
}
