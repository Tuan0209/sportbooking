package com.sportbooking.api.controller.booking;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

import com.sportbooking.api.common.ApiResponse;
import com.sportbooking.api.dto.response.booking.AdminBookingResponse;
import com.sportbooking.api.service.booking.BookingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/bookings")
@RequiredArgsConstructor
public class AdminBookingController {

    private final BookingService bookingService;

    @GetMapping
    public ApiResponse<List<AdminBookingResponse>> list(
            @RequestParam(required = false) String status) {
        return ApiResponse.<List<AdminBookingResponse>>builder()
                .code(0)
                .result(bookingService.adminList(status))
                .build();
    }

    @PostMapping("/{id}/status")
    public ApiResponse<AdminBookingResponse> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        return ApiResponse.<AdminBookingResponse>builder()
                .code(0)
                .result(bookingService.adminUpdateStatus(id, body.get("status")))
                .build();
    }
}
