package com.sportbooking.api.dto.response.fields;

import java.time.LocalDateTime;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FieldTypeResponse {

    String id;
    String name;
    LocalDateTime createdAt;
}