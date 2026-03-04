package com.sportbooking.api.dto.request.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE) // mọi thuộc tính đều là private
public class LoginRequest {
    private String identifier;
    private String email; // fallback nếu frontend gửi email
    private String phone; // fallback nếu frontend gửi phone
    private String password;

    // Tự động lấy đúng identifier dù frontend gửi field nào
    public String getIdentifier() {
        if (identifier != null)
            return identifier;
        if (email != null)
            return email;
        if (phone != null)
            return phone;
        return null;
    }
}