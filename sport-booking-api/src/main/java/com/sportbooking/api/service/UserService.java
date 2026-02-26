package com.sportbooking.api.service;

import org.springframework.stereotype.Service;

import com.sportbooking.api.dto.request.UserCreateRequest;
import com.sportbooking.api.dto.response.ApiResponse;
import com.sportbooking.api.dto.response.UserResponse;
import com.sportbooking.api.entity.User;
import com.sportbooking.api.exception.AppException;
import com.sportbooking.api.exception.ErrorCode;
import com.sportbooking.api.repository.UserRepository;
import com.sportbooking.api.mapper.UserMapper;
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

    UserResponse createUser(UserCreateRequest request) {
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

    List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toUserResponse)
                .toList();
    }

}
