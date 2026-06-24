package com.sportbooking.api.dto.response.booking;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

/** Một khung giờ đã được đặt của một sân trong ngày (dùng để tô màu lịch). */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookedSlotResponse {
    String fieldId;
    String startTime; // dạng "HH:mm"
}
