package com.sportbooking.api.controller.payment;

import java.time.LocalDateTime;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;
import com.sportbooking.api.common.ApiResponse;
import com.sportbooking.api.common.enums.BookingStatus;
import com.sportbooking.api.common.enums.ErrorCode;
import com.sportbooking.api.common.enums.PaymentStatus;
import com.sportbooking.api.common.exception.AppException;
import com.sportbooking.api.dto.response.payment.PaymentResponse;
import com.sportbooking.api.entity.booking.Booking;
import com.sportbooking.api.entity.payment.Payment;
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

    /**
     * Giả lập PayOS thanh toán thành công (chế độ demo khi chưa có tài khoản
     * PayOS).
     */
    @PostMapping("/{id}/mock-success")
    public ApiResponse<PaymentResponse> mockSuccess(@PathVariable String id) {
        return ApiResponse.<PaymentResponse>builder()
                .code(0)
                .result(paymentService.mockSuccess(id))
                .build();
    }

    @PostMapping("/payos/webhook")
    public ResponseEntity<?> payosWebhook(@RequestBody Map<String, Object> body) {

        try {
            System.out.println("\n========== WEBHOOK RECEIVED ==========");
            System.out.println("BODY = " + body);

            paymentService.handlePayosWebhook(body);

            System.out.println("========== WEBHOOK SUCCESS ==========\n");

            return ResponseEntity.ok("OK");

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.status(500).body(Map.of(
                    "exception", e.getClass().getSimpleName(),
                    "message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/payos-success")
    public ApiResponse<PaymentResponse> payosSuccess(
            @PathVariable String id) {

        return ApiResponse.<PaymentResponse>builder()
                .code(0)
                .result(paymentService.payosSuccess(id))
                .build();
    }
}
