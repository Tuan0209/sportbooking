package com.sportbooking.api.mapper;

import org.mapstruct.*;

import com.sportbooking.api.dto.request.fields.FieldPriceSlotCreateRequest;
import com.sportbooking.api.dto.request.fields.FieldPriceSlotUpdateRequest;
import com.sportbooking.api.dto.response.fields.FieldPriceSlotResponse;
import com.sportbooking.api.entity.fields.FieldPriceSlot;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface FieldPriceSlotMapper {

    @Mapping(target = "fieldId", source = "field.id")
    @Mapping(target = "fieldName", source = "field.name")
    FieldPriceSlotResponse toResponse(FieldPriceSlot slot);

    @Mapping(target = "field", ignore = true) // set thu cong trong service
    FieldPriceSlot toEntity(FieldPriceSlotCreateRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "field", ignore = true)
    void updateFromRequest(FieldPriceSlotUpdateRequest request, @MappingTarget FieldPriceSlot slot);
}