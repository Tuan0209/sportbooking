package com.sportbooking.api.controller.areas;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import com.cloudinary.Api;
import com.sportbooking.api.service.areas.AreaService;

import jakarta.validation.Valid;

import com.sportbooking.api.common.ApiResponse;
import com.sportbooking.api.dto.response.areas.AreasResponse;
import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.sportbooking.api.dto.request.areas.AreaCreateRequest;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.http.ResponseEntity;

@RestController
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequestMapping("/areas")
@Slf4j
public class AreaController {
    AreaService areaService;

    @GetMapping
    ApiResponse<List<AreasResponse>> getAllAreas() {
        return ApiResponse.<List<AreasResponse>>builder()
                .result(areaService.getAllAreas())
                .build();
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    ApiResponse<AreasResponse> createArea(@Valid @RequestBody AreaCreateRequest request) {
        return ApiResponse.<AreasResponse>builder()
                .result(areaService.createArea(request))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ApiResponse<AreasResponse> updateArea(@PathVariable String id, @Valid @RequestBody AreaCreateRequest request) {
        return ApiResponse.<AreasResponse>builder()
                .result(areaService.updateArea(id, request))
                .build();

    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ApiResponse<String> deleteArea(@PathVariable String id) {

        return ApiResponse.<String>builder()
                .result(areaService.deleteArea(id))
                .build();
    }
}
