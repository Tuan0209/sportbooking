package com.sportbooking.api.controller.payment;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.sportbooking.api.common.ApiResponse;
import com.sportbooking.api.dto.response.payment.PaymentResponse;
import com.sportbooking.api.service.payment.PaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    /** Lấy thông tin thanh toán (QR, số TK, nội dung CK) của 1 booking. */
    @GetMapping("/booking/{bookingId}")
    public ApiResponse<PaymentResponse> getByBooking(@PathVariable String bookingId) {
        return ApiResponse.<PaymentResponse>builder()
                .code(0)
                .result(paymentService.getByBookingId(bookingId))
                .build();
    }

    /** Upload ảnh bill chuyển khoản. */
    @PostMapping("/{id}/proof")
    public ApiResponse<PaymentResponse> uploadProof(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file) {
        return ApiResponse.<PaymentResponse>builder()
                .code(0)
                .result(paymentService.uploadProof(id, file))
                .build();
    }

    /** Giả lập PayOS thanh toán thành công (chế độ demo khi chưa có tài khoản PayOS). */
    @PostMapping("/{id}/mock-success")
    public ApiResponse<PaymentResponse> mockSuccess(@PathVariable String id) {
        return ApiResponse.<PaymentResponse>builder()
                .code(0)
                .result(paymentService.mockSuccess(id))
                .build();
    }
}
