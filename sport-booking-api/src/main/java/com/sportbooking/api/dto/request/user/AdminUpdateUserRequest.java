package com.sportbooking.api.dto.request.user;

import java.math.BigDecimal;

import com.sportbooking.api.common.enums.Role;
import com.sportbooking.api.common.enums.Status;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class AdminUpdateUserRequest {

    @Size(min = 3, max = 100, message = "USER_INVALID")
    String name;

    @Email(message = "Invalid email format")
    @Size(max = 100)
    String email;

    @Pattern(regexp = "^[0-9]{10,11}$", message = "Phone must be 10-11 digits")
    String phone;

    // Admin-only fields — không có trong UserUpdateRequest
    Role role;

    Status status;

    @Size(min = 6, max = 255, message = "Password must be at least 6 characters")
    String password; // Nếu null/blank → giữ nguyên mật khẩu cũ

    @DecimalMin(value = "0.00", message = "Coin balance must be >= 0")
    @Digits(integer = 10, fraction = 2, message = "Invalid coin balance format")
    BigDecimal coinBalance;
}