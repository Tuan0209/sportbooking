package com.sportbooking.api.dto.response.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
@AllArgsConstructor
@lombok.NoArgsConstructor
public class AuthResponse {
    private String token;        // access token
    private String refreshToken; // refresh token
}
