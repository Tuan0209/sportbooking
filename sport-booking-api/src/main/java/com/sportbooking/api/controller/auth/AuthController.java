package com.sportbooking.api.controller.auth;

import com.sportbooking.api.common.ApiResponse;
import com.sportbooking.api.dto.request.auth.ForgotPasswordRequest;
import com.sportbooking.api.dto.request.auth.LoginRequest;
import com.sportbooking.api.dto.request.auth.RefreshTokenRequest;
import com.sportbooking.api.dto.request.auth.RegisterRequest;
import com.sportbooking.api.dto.request.auth.ResetPasswordRequest;
import com.sportbooking.api.dto.response.auth.AuthResponse;
import com.sportbooking.api.service.auth.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ApiResponse.<AuthResponse>builder()
                .message("User registered successfully")
                .build();
    }

    @PostMapping("/login")
    ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.<AuthResponse>builder()
                .result(authService.login(request))
                .build();
    }

    @PostMapping("/refresh")
    ApiResponse<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ApiResponse.<AuthResponse>builder()
                .result(authService.refresh(request.getRefreshToken()))
                .build();
    }

    @PostMapping("/forgot-password")
    ApiResponse<AuthResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ApiResponse.<AuthResponse>builder()
                .message("Nếu email tồn tại, mã xác thực đã được gửi")
                .build();
    }

    @PostMapping("/reset-password")
    ApiResponse<AuthResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ApiResponse.<AuthResponse>builder()
                .message("Đặt lại mật khẩu thành công")
                .build();
    }
}