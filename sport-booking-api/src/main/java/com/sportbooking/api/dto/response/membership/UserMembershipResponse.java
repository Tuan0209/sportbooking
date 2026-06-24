package com.sportbooking.api.dto.response.membership;

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
public class UserMembershipResponse {
    String id;
    String planName;
    Integer discountPercent;
    LocalDateTime startDate;
    LocalDateTime endDate;
    String status;
}
