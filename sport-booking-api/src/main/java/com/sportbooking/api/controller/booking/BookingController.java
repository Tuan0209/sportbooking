package com.sportbooking.api.controller.booking;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.sportbooking.api.common.ApiResponse;
import com.sportbooking.api.dto.request.booking.CreateBookingRequest;
import com.sportbooking.api.dto.request.booking.CreateMonthlyBookingRequest;
import com.sportbooking.api.dto.response.booking.BookedSlotResponse;
import com.sportbooking.api.dto.response.booking.BookingResponse;
import com.sportbooking.api.dto.response.booking.MonthlyBookingResponse;
import com.sportbooking.api.service.booking.BookingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ApiResponse<BookingResponse> create(
            @RequestBody CreateBookingRequest request,
            Authentication authentication) {

        return ApiResponse.<BookingResponse>builder()
                .code(0)
                .result(
                        bookingService.create(
                                request,
                                authentication))
                .build();
    }

    /** Các khung giờ đã đặt của 1 cơ sở trong 1 ngày (để tô màu lịch). */
    @GetMapping("/booked")
    public ApiResponse<List<BookedSlotResponse>> booked(
            @RequestParam String venueId,
            @RequestParam String date) {

        return ApiResponse.<List<BookedSlotResponse>>builder()
                .code(0)
                .result(bookingService.getBookedSlots(venueId, date))
                .build();
    }

    /** Đặt vé tháng (đặt cố định lặp theo thứ trong tuần cả tháng). */
    @PostMapping("/monthly")
    public ApiResponse<MonthlyBookingResponse> createMonthly(
            @RequestBody CreateMonthlyBookingRequest request,
            Authentication authentication) {

        return ApiResponse.<MonthlyBookingResponse>builder()
                .code(0)
                .result(bookingService.createMonthly(request, authentication))
                .build();
    }
}
