package com.sportbooking.api.controller.fields;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.sportbooking.api.common.ApiResponse;
import com.sportbooking.api.dto.request.fields.FieldTypeCreateRequest;
import com.sportbooking.api.dto.response.fields.FieldTypeResponse;
import com.sportbooking.api.service.fields.FieldTypeService;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequestMapping("/field-types")
@Slf4j
public class FieldTypeController {

    FieldTypeService fieldTypeService;

    @GetMapping
    ApiResponse<List<FieldTypeResponse>> getAllFieldTypes() {
        return ApiResponse.<List<FieldTypeResponse>>builder()
                .result(fieldTypeService.getAllFieldTypes())
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<FieldTypeResponse> getFieldTypeById(@PathVariable String id) {
        return ApiResponse.<FieldTypeResponse>builder()
                .result(fieldTypeService.getFieldTypeById(id))
                .build();
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    ApiResponse<FieldTypeResponse> createFieldType(@Valid @RequestBody FieldTypeCreateRequest request) {
        return ApiResponse.<FieldTypeResponse>builder()
                .result(fieldTypeService.createFieldType(request))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ApiResponse<FieldTypeResponse> updateFieldType(@PathVariable String id,
            @Valid @RequestBody FieldTypeCreateRequest request) {
        return ApiResponse.<FieldTypeResponse>builder()
                .result(fieldTypeService.updateFieldType(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ApiResponse<String> deleteFieldType(@PathVariable String id) {
        return ApiResponse.<String>builder()
                .result(fieldTypeService.deleteFieldType(id))
                .build();
    }
}