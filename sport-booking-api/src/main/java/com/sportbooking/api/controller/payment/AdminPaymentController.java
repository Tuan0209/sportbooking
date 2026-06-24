package com.sportbooking.api.controller.payment;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.sportbooking.api.common.ApiResponse;
import com.sportbooking.api.dto.response.payment.AdminPaymentResponse;
import com.sportbooking.api.service.payment.PaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/payments")
@RequiredArgsConstructor
public class AdminPaymentController {

    private final PaymentService paymentService;

    /** Danh sách thanh toán (QR/PayOS) để duyệt. */
    @GetMapping
    public ApiResponse<List<AdminPaymentResponse>> list() {
        return ApiResponse.<List<AdminPaymentResponse>>builder()
                .code(0)
                .result(paymentService.listForAdmin())
                .build();
    }

    /** Duyệt thanh toán -> xác nhận booking. */
    @PostMapping("/{id}/approve")
    public ApiResponse<AdminPaymentResponse> approve(@PathVariable String id) {
        return ApiResponse.<AdminPaymentResponse>builder()
                .code(0)
                .result(paymentService.approve(id))
                .build();
    }

    /** Từ chối thanh toán. */
    @PostMapping("/{id}/reject")
    public ApiResponse<AdminPaymentResponse> reject(@PathVariable String id) {
        return ApiResponse.<AdminPaymentResponse>builder()
                .code(0)
                .result(paymentService.reject(id))
                .build();
    }
}
