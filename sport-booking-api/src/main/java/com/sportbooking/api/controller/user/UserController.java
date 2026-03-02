package com.sportbooking.api.controller.user;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;

import com.sportbooking.api.common.ApiResponse;
import com.sportbooking.api.dto.request.user.UserCreateRequest;
import com.sportbooking.api.dto.request.user.UserUpdateRequest;
import com.sportbooking.api.dto.response.user.UserResponse;
import com.sportbooking.api.service.user.UserService;
import com.sportbooking.api.dto.request.user.ChangePasswordRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import java.io.IOException;
import java.util.List;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Slf4j
@PreAuthorize("hasAuthority('USER')") // Chỉ cho phép truy cập nếu user có role USER, cần cấu hình role trong
// UserDetailsServiceImpl
public class UserController {

    private final UserService userService;

    // 🔹 GET PROFILE
    @GetMapping("/me")
    public ApiResponse<UserResponse> getMyProfile() {

        String userId = getCurrentUserId();
        return ApiResponse.<UserResponse>builder()
                .result(userService.getUserById(userId))
                .build();
    }

    // 🔹 UPDATE PROFILE
    @PutMapping("/me")
    public ApiResponse<UserResponse> updateMyProfile(
            @Valid @RequestBody UserUpdateRequest request) {

        String userId = getCurrentUserId();
        return ApiResponse.<UserResponse>builder()
                .result(userService.updateUser(userId, request))
                .build();
    }

    // 🔹 CHANGE PASSWORD
    @PutMapping("/change-password")
    public ApiResponse<String> changePassword(
            @Valid @RequestBody ChangePasswordRequest request) {

        String userId = getCurrentUserId(); // Lấy userId từ token, cần cấu hình trong UserDetailsServiceImpl để trả về
                                            // userId thay vì email
        userService.changePassword(userId, request);
        return ApiResponse.<String>builder()
                .result("Password changed successfully")
                .build();
    }

    private String getCurrentUserId() {
        return SecurityContextHolder.getContext()
                .getAuthentication() //
                .getName(); //
    }
}