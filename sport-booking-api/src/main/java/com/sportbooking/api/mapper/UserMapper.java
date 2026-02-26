package com.sportbooking.api.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import com.sportbooking.api.entity.User;
import com.sportbooking.api.dto.request.UserCreateRequest;
import com.sportbooking.api.dto.response.UserResponse;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE) // bo qua cac truong ko duoc map de ko
                                                                                  // bi loi
public interface UserMapper {

    UserResponse toUserResponse(User user); // map User sang UserResponse

    User toUser(UserCreateRequest request); // map UserCreateRequest sang User

}
