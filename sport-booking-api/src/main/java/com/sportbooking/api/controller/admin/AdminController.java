package com.sportbooking.api.controller.admin;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
import com.sportbooking.api.dto.request.user.AdminUpdateUserRequest;
import com.sportbooking.api.common.ApiResponse;
import com.sportbooking.api.dto.request.user.UserCreateRequest;
import com.sportbooking.api.dto.request.user.UserUpdateRequest;
import com.sportbooking.api.dto.response.user.UserResponse;
import com.sportbooking.api.service.user.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.List;
import org.springframework.web.bind.annotation.PutMapping;

@Slf4j // Tự động tạo logger cho class này, có thể dùng log.info(), log.error() để ghi
       // log
@Builder
@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@PreAuthorize("hasAuthority('ADMIN')") // Chỉ cho phép truy cập nếu user có role ADMIN, cần cấu hình role trong
// UserDetailsServiceImpl
public class AdminController {

    UserService userService;

    // ── CREATE ──────────────────────────────────────────────────────────────────

    @PostMapping
    ApiResponse<UserResponse> createUser(@Valid @RequestBody UserCreateRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.createUser(request))
                .build();
    }

    // ── READ ─────────────────────────────────────────────────────────────────────

    @GetMapping
    ApiResponse<List<UserResponse>> listUsers() {
        return ApiResponse.<List<UserResponse>>builder()
                .result(userService.getAllUsers())
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<UserResponse> getUserById(@PathVariable String id) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getUserById(id))
                .build();
    }

    // ── UPDATE (full — admin only) ───────────────────────────────────────────────
    // Admin được cập nhật tất cả: name, email, phone, role, status, password,
    // coinBalance

    @PutMapping("/{id}")
    ApiResponse<UserResponse> updateUser(
            @PathVariable String id,
            @Valid @RequestBody AdminUpdateUserRequest request) {

        return ApiResponse.<UserResponse>builder()
                .message("User has been updated successfully.")
                .result(userService.adminUpdateUser(id, request))
                .build();
    }

    // ── UPDATE AVATAR ────────────────────────────────────────────────────────────

    @PutMapping(value = "/{id}/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ApiResponse<UserResponse> updateAvatar(
            @PathVariable String id,
            @RequestParam(required = false) MultipartFile file,
            @RequestParam(required = false) String imageUrl) throws IOException {

        return ApiResponse.<UserResponse>builder()
                .result(userService.updateAvatar(id, file, imageUrl))
                .build();
    }

    // ── DELETE ───────────────────────────────────────────────────────────────────

    @DeleteMapping("/{id}")
    ApiResponse<String> deleteUser(@PathVariable String id) {
        return ApiResponse.<String>builder()
                .result(userService.deleteUser(id))
                .build();
    }
}