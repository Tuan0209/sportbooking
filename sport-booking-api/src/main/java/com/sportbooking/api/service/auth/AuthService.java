package com.sportbooking.api.service.auth;

import com.sportbooking.api.common.enums.ErrorCode;
import com.sportbooking.api.common.enums.Role;
import com.sportbooking.api.dto.request.auth.LoginRequest;
import com.sportbooking.api.dto.request.auth.RegisterRequest;
import com.sportbooking.api.dto.response.auth.AuthResponse;
import com.sportbooking.api.entity.user.User;
import com.sportbooking.api.repository.user.UserRepository;
import com.sportbooking.api.security.JwtService;
import com.sportbooking.api.common.exception.AppException;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

        String identifier = request.getIdentifier(); // email hoặc phone

        User user = identifier.contains("@")
                ? userRepository.findByEmail(identifier)
                        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND))
                : userRepository.findByPhone(identifier)
                        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.WRONG_PASSWORD);
        }

        String token = jwtService.generateToken(user);
        return new AuthResponse(token);
    }
}
