package com.sportbooking.api.controller.review;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.sportbooking.api.common.ApiResponse;
import com.sportbooking.api.dto.request.review.CreateReviewRequest;
import com.sportbooking.api.dto.response.review.ReviewResponse;
import com.sportbooking.api.dto.response.review.VenueReviewsResponse;
import com.sportbooking.api.service.review.ReviewService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ApiResponse<ReviewResponse> create(
            @Valid @RequestBody CreateReviewRequest request,
            Authentication authentication) {
        return ApiResponse.<ReviewResponse>builder()
                .code(0)
                .result(reviewService.create(request, authentication))
                .build();
    }

    @GetMapping("/venue/{venueId}")
    public ApiResponse<VenueReviewsResponse> byVenue(@PathVariable String venueId) {
        return ApiResponse.<VenueReviewsResponse>builder()
                .code(0)
                .result(reviewService.getByVenue(venueId))
                .build();
    }
}
