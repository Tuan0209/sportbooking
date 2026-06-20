package com.sportbooking.api.mapper;

import org.mapstruct.Mapper;

import com.sportbooking.api.dto.request.fields.FieldTypeCreateRequest;
import com.sportbooking.api.dto.response.fields.FieldTypeResponse;
import com.sportbooking.api.entity.fields.FieldType;

@Mapper(componentModel = "spring") // dat ten cho class generate ra
                                   // de co the inject vao service

public interface FieldTypeMapper {

    FieldTypeResponse toFieldTypeResponse(FieldType fieldType); // map FieldType sang FieldTypeResponse

    FieldType toFieldType(FieldTypeCreateRequest request); // map FieldTypeCreateRequest sang FieldType
}