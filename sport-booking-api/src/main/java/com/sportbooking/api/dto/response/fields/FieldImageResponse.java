package com.sportbooking.api.dto.response.fields;

import java.time.LocalDateTime;

import com.sportbooking.api.common.enums.FieldImageType;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FieldImageResponse {

    String id;
    String fieldId;
    String fieldName;
    String imageUrl;
    FieldImageType type;
    boolean isPrimary;
    int sortOrder;
    LocalDateTime createdAt;
}