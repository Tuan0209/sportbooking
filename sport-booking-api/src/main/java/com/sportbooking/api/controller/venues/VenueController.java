package com.sportbooking.api.controller.venues;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import com.sportbooking.api.common.ApiResponse;
import com.sportbooking.api.dto.request.venues.VenueCreateRequest;
import com.sportbooking.api.dto.request.venues.VenueUpdateRequest;
import com.sportbooking.api.dto.response.venues.VenueResponse;
import com.sportbooking.api.service.venues.VenueService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/venues")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Slf4j
public class VenueController {

    private final VenueService venueService;

    @GetMapping
    public ApiResponse<List<VenueResponse>> getAll() {
        return ApiResponse.<List<VenueResponse>>builder()
                .result(venueService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<VenueResponse> getById(@PathVariable String id) {
        return ApiResponse.<VenueResponse>builder()
                .result(venueService.getById(id))
                .build();
    }

    @GetMapping("/area/{areaId}")
    public ApiResponse<List<VenueResponse>> getByArea(@PathVariable String areaId) {
        return ApiResponse.<List<VenueResponse>>builder()
                .result(venueService.getByArea(areaId))
                .build();
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<VenueResponse> create(@RequestBody @Valid VenueCreateRequest request) {
        return ApiResponse.<VenueResponse>builder()
                .result(venueService.create(request))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<VenueResponse> update(@PathVariable String id,
            @RequestBody VenueUpdateRequest request) {
        return ApiResponse.<VenueResponse>builder()
                .result(venueService.update(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<String> delete(@PathVariable String id) {
        return ApiResponse.<String>builder()
                .result(venueService.delete(id))
                .build();
    }
}