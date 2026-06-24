package com.sportbooking.api.controller.service;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.sportbooking.api.common.ApiResponse;
import com.sportbooking.api.dto.request.service.ServiceRequest;
import com.sportbooking.api.dto.response.service.ServiceResponse;
import com.sportbooking.api.service.service.ServiceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/services")
@RequiredArgsConstructor
public class AdminServiceController {

    private final ServiceService serviceService;

    @GetMapping
    public ApiResponse<List<ServiceResponse>> list() {
        return ApiResponse.<List<ServiceResponse>>builder().code(0)
                .result(serviceService.listAll()).build();
    }

    @PostMapping
    public ApiResponse<ServiceResponse> create(@RequestBody ServiceRequest req) {
        return ApiResponse.<ServiceResponse>builder().code(0)
                .result(serviceService.create(req)).build();
    }

    @PutMapping("/{id}")
    public ApiResponse<ServiceResponse> update(@PathVariable String id, @RequestBody ServiceRequest req) {
        return ApiResponse.<ServiceResponse>builder().code(0)
                .result(serviceService.update(id, req)).build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable String id) {
        serviceService.delete(id);
        return ApiResponse.<String>builder().code(0).result("Đã xoá").build();
    }
}
