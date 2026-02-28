package com.sportbooking.api.user.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import com.sportbooking.api.common.enums.ErrorCode;
import com.sportbooking.api.common.exception.AppException;
import com.sportbooking.api.user.dto.request.UserCreateRequest;
import com.sportbooking.api.user.dto.request.UserUpdateRequest;
import com.sportbooking.api.user.dto.response.ApiResponse;
import com.sportbooking.api.user.dto.response.UserResponse;
import com.sportbooking.api.user.entity.User;
import com.sportbooking.api.user.mapper.UserMapper;
import com.sportbooking.api.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
//import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.List;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Slf4j
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    String UPLOAD_DIR = "uploads/"; // Thư mục lưu trữ ảnh, có thể cấu hình trong application.properties

    public UserResponse createUser(UserCreateRequest request) {
        // Kiểm tra email tồn tại
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.USER_EXISTS);
        }
        // PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10); // Tạo
        // password encoder với strength 10
        // Tạo entity
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                // .password(passwordEncoder.encode(request.getPassword()))
                .password(request.getPassword())
                .phone(request.getPhone())
                .build();
        User savedUser = userRepository.save(user);
        return userMapper.toUserResponse(savedUser);
    }

    // Lấy danh sách tất cả user
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toUserResponse)
                .toList();
    }

    // Lấy thông tin user theo id
    public UserResponse getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toUserResponse(user);
    }

    // Xóa user theo id, trả về thông tin user đã xóa
    public String deleteUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        userRepository.delete(user);
        return "User with id " + id + " has been deleted successfully.";
    }

    // Cập nhật thông tin user theo id, trả về thông tin user đã cập nhật
    public UserResponse updateUser(String id, UserUpdateRequest request) {
        if (userRepository.existsByEmailAndIdNot(request.getEmail(), id)) { // Kiểm tra email đã tồn tại trên user khác
                                                                            // chưa
            throw new AppException(ErrorCode.EMAIL_EXISTS);
        }
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        User updatedUser = userRepository.save(user);
        return userMapper.toUserResponse(updatedUser);
    }

    // Cập nhật avatar cho user, có thể upload file hoặc cung cấp URL của ảnh
    public UserResponse updateAvatar(
            String userId,
            MultipartFile file,
            String imageUrl) throws IOException {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {

                    return new AppException(ErrorCode.USER_NOT_FOUND);
                });

        // Upload từ file
        if (file != null && !file.isEmpty()) {

            if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {

                throw new RuntimeException("Chỉ cho phép file ảnh");
            }

            File directory = new File(UPLOAD_DIR);
            if (!directory.exists()) {

                directory.mkdirs();
            }

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR + fileName);

            try {
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            } catch (IOException e) {

                throw e;
            }

            user.setAvatarUrl(fileName);
        }

        // Upload từ link
        else if (imageUrl != null && !imageUrl.isBlank()) {

            user.setAvatarUrl(imageUrl);
        }

        else {

            throw new RuntimeException("Phải cung cấp file hoặc imageUrl");
        }

        userRepository.save(user);

        return userMapper.toUserResponse(user);
    }
}