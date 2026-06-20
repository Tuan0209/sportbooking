package com.sportbooking.api.controller.booking;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.sportbooking.api.common.ApiResponse;
import com.sportbooking.api.dto.request.booking.CreateBookingRequest;
import com.sportbooking.api.dto.response.booking.BookingResponse;
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
}
