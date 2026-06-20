package com.sportbooking.api.controller.fields;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.sportbooking.api.common.ApiResponse;
import com.sportbooking.api.dto.request.fields.FieldCreateRequest;
import com.sportbooking.api.dto.request.fields.FieldUpdateRequest;
import com.sportbooking.api.dto.response.fields.FieldResponse;
import com.sportbooking.api.dto.response.fields.TimeSlotResponse;
import com.sportbooking.api.repository.fields.FieldRepository;
import com.sportbooking.api.service.fields.FieldService;
import com.sportbooking.api.service.fields.FieldTimeSlotService;
import com.sportbooking.api.entity.fields.Field;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequestMapping("/fields")
@Slf4j
public class FieldController {
    FieldRepository fieldRepository;
    FieldTimeSlotService fieldTimeSlotService;
    FieldService fieldService;

    @GetMapping
    ApiResponse<List<FieldResponse>> getFields(
            @RequestParam(required = false) String areaId,
            @RequestParam(required = false) String fieldTypeId) {
        return ApiResponse.<List<FieldResponse>>builder()
                .result(fieldService.getFields(areaId, fieldTypeId))
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<FieldResponse> getFieldById(@PathVariable String id) {
        return ApiResponse.<FieldResponse>builder()
                .result(fieldService.getFieldById(id))
                .build();
    }

    @GetMapping("/area/{areaId}")
    ApiResponse<List<FieldResponse>> getFieldsByAreaId(@PathVariable String areaId) {
        return ApiResponse.<List<FieldResponse>>builder()
                .result(fieldService.getFieldsByAreaId(areaId))
                .build();
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    ApiResponse<FieldResponse> createField(@Valid @RequestBody FieldCreateRequest request) {
        return ApiResponse.<FieldResponse>builder()
                .result(fieldService.createField(request))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ApiResponse<FieldResponse> updateField(@PathVariable String id,
            @Valid @RequestBody FieldUpdateRequest request) {
        return ApiResponse.<FieldResponse>builder()
                .result(fieldService.updateField(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ApiResponse<String> deleteField(@PathVariable String id) {
        return ApiResponse.<String>builder()
                .result(fieldService.deleteField(id))
                .build();
    }

    @GetMapping("/{fieldId}/time-slots")
    public List<TimeSlotResponse> getTimeSlots(@PathVariable String fieldId) {

        Field field = fieldRepository.findById(fieldId)
                .orElseThrow(() -> new RuntimeException("Field not found: " + fieldId));

        return fieldTimeSlotService.generateSlots(field);
    }
}