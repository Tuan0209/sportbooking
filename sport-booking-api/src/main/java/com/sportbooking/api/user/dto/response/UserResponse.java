package com.sportbooking.api.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.sportbooking.api.common.enums.Role;
import com.sportbooking.api.common.enums.Status;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserResponse {
    private String id;
    private String name;
    private String email;
    private String phone;
    private Role role;
    private Status status;
    private BigDecimal coinBalance;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
