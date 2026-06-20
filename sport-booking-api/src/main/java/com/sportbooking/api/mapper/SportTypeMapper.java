package com.sportbooking.api.mapper;

import org.mapstruct.*;
import com.sportbooking.api.dto.request.sport.SportTypeRequest;
import com.sportbooking.api.dto.response.sport.SportTypeResponse;
import com.sportbooking.api.entity.sport.SportType;

@Mapper(componentModel = "spring")
public interface SportTypeMapper {

    SportType toEntity(SportTypeRequest request);

    SportTypeResponse toResponse(SportType entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void update(@MappingTarget SportType entity, SportTypeRequest request);
}