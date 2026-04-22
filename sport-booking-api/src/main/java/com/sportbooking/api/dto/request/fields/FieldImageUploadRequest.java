package com.sportbooking.api.dto.request.fields;

import com.sportbooking.api.common.enums.FieldImageType;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FieldImageUploadRequest {

    // loai anh: cover, gallery, thumbnail (mac dinh la gallery)
    FieldImageType type = FieldImageType.gallery;

    // anh chinh hay khong (mac dinh la false)
    boolean isPrimary = false;

    // thu tu hien thi trong gallery (mac dinh la 0)
    int sortOrder = 0;
}