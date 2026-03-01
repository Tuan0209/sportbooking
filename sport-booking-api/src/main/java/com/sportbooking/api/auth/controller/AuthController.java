package com.sportbooking.api.auth.controller;

import com.sportbooking.api.auth.service.AuthService;
import com.sportbooking.api.user.dto.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.sportbooking.api.auth.dto.request.LoginRequest;
import com.sportbooking.api.auth.dto.request.RegisterRequest;
import com.sportbooking.api.auth.dto.response.AuthResponse;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    ApiResponse<AuthResponse> register(@RequestBody RegisterRequest request) {
        authService.register(request);
        return ApiResponse.<AuthResponse>builder()
                .message("User registered successfully")
                .build();
    }

    @PostMapping("/login")
    ApiResponse<AuthResponse> login(@RequestBody LoginRequest request) {
        return ApiResponse.<AuthResponse>builder()
                .result(authService.login(request))
                .build();
    }
}