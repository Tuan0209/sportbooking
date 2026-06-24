package com.sportbooking.api.dto.response.voucher;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VoucherResponse {
    String id;
    String code;
    String description;
    String discountType;
    BigDecimal discountValue;
    BigDecimal minOrder;
    BigDecimal maxDiscount;
    Integer usageLimit;
    Integer usedCount;
    LocalDateTime startDate;
    LocalDateTime endDate;
    String status;
}
