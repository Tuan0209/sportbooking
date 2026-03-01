package com.sportbooking.api.auth.service;

import com.sportbooking.api.common.enums.Role;
import com.sportbooking.api.user.entity.User;
import com.sportbooking.api.user.repository.UserRepository;
import com.sportbooking.api.security.JwtService;

import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sportbooking.api.auth.dto.request.LoginRequest;
import com.sportbooking.api.auth.dto.request.RegisterRequest;
import com.sportbooking.api.auth.dto.response.AuthResponse;

@Builder
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public void register(RegisterRequest request) {
        // tạo user
        var user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(Role.USER)
                .build();

        userRepository.save(user);

    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {
            throw new RuntimeException("Wrong password");
        }

        String token = jwtService.generateToken(user);

        return new AuthResponse(token);
    }
}
