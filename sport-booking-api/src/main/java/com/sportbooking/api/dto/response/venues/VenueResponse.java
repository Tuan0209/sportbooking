package com.sportbooking.api.dto.response.venues;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import com.sportbooking.api.common.enums.VenueStatus;
import com.sportbooking.api.dto.response.fields.FieldResponse;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import lombok.Builder;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VenueResponse {
    String id;
    String name;
    String address;

    String areaId;
    String areaName;

    BigDecimal latitude;
    BigDecimal longitude;
    LocalTime openTime;

    LocalTime closeTime;
    List<FieldResponse> fields; // 🔥 quan trọng

    int totalFields;
    String coverUrl; // anh cover (banner)
    String thumbnailUrl; // anh thumbnail (logo tron)
    Integer totalReviews;
    BigDecimal rating;
    Boolean isFavorite;
    VenueStatus status;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
