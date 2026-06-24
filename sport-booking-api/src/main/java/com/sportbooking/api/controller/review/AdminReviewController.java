package com.sportbooking.api.controller.review;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.sportbooking.api.common.ApiResponse;
import com.sportbooking.api.dto.response.review.ReviewResponse;
import com.sportbooking.api.service.review.ReviewService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/reviews")
@RequiredArgsConstructor
public class AdminReviewController {

    private final ReviewService reviewService;

    @GetMapping
    public ApiResponse<List<ReviewResponse>> list() {
        return ApiResponse.<List<ReviewResponse>>builder().code(0)
                .result(reviewService.adminListAll()).build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable String id) {
        reviewService.adminDelete(id);
        return ApiResponse.<String>builder().code(0).result("Đã xoá").build();
    }
}
