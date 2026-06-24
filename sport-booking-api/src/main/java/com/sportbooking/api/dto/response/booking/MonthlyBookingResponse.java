package com.sportbooking.api.dto.response.booking;

import java.math.BigDecimal;
import java.util.List;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

/** Kết quả tạo vé tháng. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MonthlyBookingResponse {
    int createdCount;           // số buổi đã tạo
    BigDecimal totalPrice;      // tổng tiền các buổi tạo
    List<String> createdDates;  // các ngày đã đặt thành công (YYYY-MM-DD)
    List<String> skippedDates;  // các ngày bị bỏ qua do trùng (YYYY-MM-DD)
}
