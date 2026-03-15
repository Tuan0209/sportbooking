package com.sportbooking.api.dto.request.fields;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FieldTypeCreateRequest {

    @NotBlank(message = "Tên loại sân không được để trống")
    @Size(max = 50, message = "Tên loại sân không được vượt quá 50 ký tự")
    String name;
}