package com.sportbooking.api.controller.service;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.sportbooking.api.common.ApiResponse;
import com.sportbooking.api.dto.response.service.ServiceResponse;
import com.sportbooking.api.service.service.ServiceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/services")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceService serviceService;

    /** Danh sách dịch vụ đang hoạt động (cho khách chọn khi đặt). */
    @GetMapping
    public ApiResponse<List<ServiceResponse>> list() {
        return ApiResponse.<List<ServiceResponse>>builder()
                .code(0)
                .result(serviceService.listActive())
                .build();
    }
}
