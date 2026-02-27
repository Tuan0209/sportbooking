package com.sportbooking.api.dto.request;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.Builder;
import jakarta.validation.constraints.Pattern;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE) // mọi thuộc tính đều là private
public class UserUpdateRequest {

    @Size(min = 3, max = 100, message = "USER_INVALID")
    private String name;

    @Email(message = "Invalid email format")
    @Size(max = 100)
    private String email;

    @Pattern(regexp = "^[0-9]{10,11}$", message = "Phone must be 10-11 digits") // chua 10-11 chu so
    private String phone;

}
