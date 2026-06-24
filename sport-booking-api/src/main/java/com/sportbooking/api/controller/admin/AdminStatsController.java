package com.sportbooking.api.controller.admin;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sportbooking.api.common.ApiResponse;
import com.sportbooking.api.dto.response.admin.AdminStatsResponse;
import com.sportbooking.api.service.admin.AdminStatsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/stats")
@RequiredArgsConstructor
public class AdminStatsController {

    private final AdminStatsService adminStatsService;

    @GetMapping
    public ApiResponse<AdminStatsResponse> stats() {
        return ApiResponse.<AdminStatsResponse>builder()
                .code(0)
                .result(adminStatsService.getStats())
                .build();
    }
}
