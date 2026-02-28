package com.sportbooking.api.user.service;

import org.springframework.stereotype.Service;

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
}
