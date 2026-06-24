package com.sportbooking.api.dto.response.membership;

import java.math.BigDecimal;
import java.util.List;

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
public class MembershipPlanResponse {
    String id;
    String name;
    String description;
    BigDecimal price;
    Integer durationDays;
    Integer discountPercent;
    List<String> benefits;
    String status;
}
