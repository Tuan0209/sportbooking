package com.sportbooking.api.controller.refund;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.sportbooking.api.common.ApiResponse;
import com.sportbooking.api.dto.request.refund.CreateRefundRequest;
import com.sportbooking.api.dto.response.refund.AdminRefundResponse;
import com.sportbooking.api.service.refund.RefundService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/refunds")
@RequiredArgsConstructor
public class RefundController {

    private final RefundService refundService;

    /** Người dùng gửi yêu cầu hoàn tiền. */
    @PostMapping
    public ApiResponse<AdminRefundResponse> create(
            @Valid @RequestBody CreateRefundRequest request,
            Authentication authentication) {
        return ApiResponse.<AdminRefundResponse>builder()
                .code(0)
                .result(refundService.createRequest(authentication.getName(), request))
                .build();
    }
}
