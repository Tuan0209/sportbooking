package com.sportbooking.api.mapper;

import org.mapstruct.*;

import com.sportbooking.api.dto.request.fields.FieldCreateRequest;
import com.sportbooking.api.dto.request.fields.FieldUpdateRequest;
import com.sportbooking.api.dto.response.fields.FieldResponse;
import com.sportbooking.api.entity.fields.Field;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface FieldMapper {

    // ─── ENTITY → RESPONSE ─────────────────────────────
    @Mapping(target = "fieldTypeId", source = "fieldType.id")
    @Mapping(target = "fieldTypeName", source = "fieldType.name")

    @Mapping(target = "venueId", source = "venue.id")
    @Mapping(target = "venueName", source = "venue.name")

    // nếu muốn lấy luôn area từ venue
    @Mapping(target = "areaId", source = "venue.area.id")
    @Mapping(target = "areaName", source = "venue.area.name")
    @Mapping(target = "sportTypeId", source = "fieldType.sportType.id")
    @Mapping(target = "sportTypeName", source = "fieldType.sportType.name")

    @Mapping(target = "priceSlots", source = "priceSlots")
    @Mapping(target = "slotInterval", source = "slotInterval")
    FieldResponse toFieldResponse(Field field);

    // ─── CREATE ─────────────────────────────
    @Mapping(target = "fieldType", ignore = true)
    @Mapping(target = "venue", ignore = true)
    @Mapping(target = "priceSlots", ignore = true)
    @Mapping(target = "slotInterval", ignore = true)

    Field toField(FieldCreateRequest request);

    // ─── UPDATE ─────────────────────────────
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "fieldType", ignore = true)
    @Mapping(target = "venue", ignore = true)
    @Mapping(target = "priceSlots", ignore = true)
    @Mapping(target = "slotInterval", source = "slotInterval")
    void updateFieldFromRequest(FieldUpdateRequest request, @MappingTarget Field field);
}