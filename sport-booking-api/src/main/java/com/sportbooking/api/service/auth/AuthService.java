package com.sportbooking.api.service.auth;

import com.sportbooking.api.common.enums.ErrorCode;
import com.sportbooking.api.common.enums.Role;
import com.sportbooking.api.dto.request.auth.ForgotPasswordRequest;
import com.sportbooking.api.dto.request.auth.LoginRequest;
import com.sportbooking.api.dto.request.auth.RegisterRequest;
import com.sportbooking.api.dto.request.auth.ResetPasswordRequest;
import com.sportbooking.api.dto.response.auth.AuthResponse;
import com.sportbooking.api.entity.user.User;
import com.sportbooking.api.repository.user.UserRepository;
import com.sportbooking.api.security.JwtService;
import com.sportbooking.api.service.notification.EmailService;
import com.sportbooking.api.common.exception.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    private static final long OTP_TTL_SECONDS = 300;
    private static final int OTP_MAX_ATTEMPTS = 5;
    private final SecureRandom secureRandom = new SecureRandom();
    private final ConcurrentHashMap<String, OtpEntry> otpStore = new ConcurrentHashMap<>();

    private static class OtpEntry {
        final String code;
        final Instant expiresAt;
        int attempts;

        OtpEntry(String code, Instant expiresAt) {
            this.code = code;
            this.expiresAt = expiresAt;
            this.attempts = 0;
        }
    }

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

        return AuthResponse.builder()
                .token(jwtService.generateToken(user))
                .refreshToken(jwtService.generateRefreshToken(user))
                .build();
    }

    /** Cấp lại access token (và refresh token mới) từ refresh token hợp lệ. */
    public AuthResponse refresh(String refreshToken) {
        if (refreshToken == null || !jwtService.isRefreshTokenValid(refreshToken)) {
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }
        String userId = jwtService.extractUserId(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return AuthResponse.builder()
                .token(jwtService.generateToken(user))
                .refreshToken(jwtService.generateRefreshToken(user)) // xoay vòng refresh token
                .build();
    }

    /** Bước 1: gửi mã OTP về email nếu tài khoản tồn tại. */
    public void forgotPassword(ForgotPasswordRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        // Không tiết lộ email có tồn tại hay không (chống dò tài khoản)
        var userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return;
        }

        String otp = String.format("%06d", secureRandom.nextInt(1_000_000));
        otpStore.put(email, new OtpEntry(otp, Instant.now().plusSeconds(OTP_TTL_SECONDS)));

        if (!emailService.sendPasswordResetOtp(email, otp)) {
            otpStore.remove(email);
            throw new AppException(ErrorCode.OTP_SEND_FAILED);
        }
    }

    /** Bước 2: xác minh OTP rồi đổi mật khẩu. */
    public void resetPassword(ResetPasswordRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        OtpEntry entry = otpStore.get(email);
        if (entry == null || Instant.now().isAfter(entry.expiresAt)) {
            otpStore.remove(email);
            throw new AppException(ErrorCode.OTP_INVALID);
        }

        entry.attempts++;
        if (entry.attempts > OTP_MAX_ATTEMPTS) {
            otpStore.remove(email);
            throw new AppException(ErrorCode.OTP_INVALID);
        }

        if (!entry.code.equals(request.getOtp().trim())) {
            throw new AppException(ErrorCode.OTP_INVALID);
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.RESET_INFO_MISMATCH));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        otpStore.remove(email);
    }
}
