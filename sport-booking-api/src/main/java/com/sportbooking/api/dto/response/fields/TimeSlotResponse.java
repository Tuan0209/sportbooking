package com.sportbooking.api.dto.response.fields;

import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TimeSlotResponse {
    private LocalTime start;
    private LocalTime end;
    private String label; // "05:00 - 05:30"
}