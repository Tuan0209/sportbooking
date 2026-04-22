package com.sportbooking.api.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.sportbooking.api.dto.response.fields.FieldImageResponse;
import com.sportbooking.api.entity.fields.FieldImage;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface FieldImageMapper {

    @Mapping(target = "fieldId", source = "field.id")
    @Mapping(target = "fieldName", source = "field.name")
    FieldImageResponse toFieldImageResponse(FieldImage fieldImage);
}