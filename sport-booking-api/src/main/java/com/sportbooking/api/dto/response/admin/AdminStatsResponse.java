package com.sportbooking.api.dto.response.admin;

import java.math.BigDecimal;

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
public class AdminStatsResponse {
    long totalVenues;
    long totalFields;
    long totalUsers;
    long totalBookings;
    long todayBookings;
    long pendingPayments;
    long pendingRefunds;
    BigDecimal totalRevenue;
}
