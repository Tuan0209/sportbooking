package com.sportbooking.api.mapper;

import org.mapstruct.*;

import com.sportbooking.api.dto.request.fields.FieldCreateRequest;
import com.sportbooking.api.dto.request.fields.FieldUpdateRequest;
import com.sportbooking.api.dto.response.fields.FieldResponse;
import com.sportbooking.api.entity.fields.Field;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface FieldMapper {

    @Mapping(target = "areaId", source = "area.id")
    @Mapping(target = "areaName", source = "area.name")
    @Mapping(target = "fieldTypeId", source = "fieldType.id")
    @Mapping(target = "fieldTypeName", source = "fieldType.name")
    FieldResponse toFieldResponse(Field field); // map Field sang FieldResponse

    @Mapping(target = "area", ignore = true) // set thủ công trong service
    @Mapping(target = "fieldType", ignore = true) // set thủ công trong service
    Field toField(FieldCreateRequest request); // map FieldCreateRequest sang Field

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "area", ignore = true)
    @Mapping(target = "fieldType", ignore = true)
    void updateFieldFromRequest(FieldUpdateRequest request, @MappingTarget Field field); // partial update
}