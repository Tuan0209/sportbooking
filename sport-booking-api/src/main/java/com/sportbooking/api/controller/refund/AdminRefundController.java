package com.sportbooking.api.controller.refund;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.sportbooking.api.common.ApiResponse;
import com.sportbooking.api.dto.request.refund.ApproveRefundRequest;
import com.sportbooking.api.dto.response.refund.AdminRefundResponse;
import com.sportbooking.api.service.refund.RefundService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/refunds")
@RequiredArgsConstructor
public class AdminRefundController {

    private final RefundService refundService;

    @GetMapping
    public ApiResponse<List<AdminRefundResponse>> list() {
        return ApiResponse.<List<AdminRefundResponse>>builder()
                .code(0)
                .result(refundService.listForAdmin())
                .build();
    }

    @PostMapping("/{id}/approve")
    public ApiResponse<AdminRefundResponse> approve(
            @PathVariable String id,
            @RequestBody(required = false) ApproveRefundRequest body,
            Authentication authentication) {
        return ApiResponse.<AdminRefundResponse>builder()
                .code(0)
                .result(refundService.approve(id, authentication.getName(), body))
                .build();
    }

    @PostMapping("/{id}/reject")
    public ApiResponse<AdminRefundResponse> reject(
            @PathVariable String id,
            Authentication authentication) {
        return ApiResponse.<AdminRefundResponse>builder()
                .code(0)
                .result(refundService.reject(id, authentication.getName()))
                .build();
    }
}
