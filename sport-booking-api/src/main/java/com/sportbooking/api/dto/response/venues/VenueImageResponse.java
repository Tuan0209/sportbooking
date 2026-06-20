package com.sportbooking.api.dto.response.venues;

import java.time.LocalDateTime;

import com.sportbooking.api.common.enums.VenueImageType;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VenueImageResponse {
    String id;
    String venueId;
    // String venueName;
    String imageUrl;
    VenueImageType type;
    boolean isPrimary;
    int sortOrder;
    LocalDateTime createdAt;
}
