package com.sportbooking.api.controller.fields;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sportbooking.api.common.ApiResponse;
import com.sportbooking.api.dto.request.fields.FieldPriceSlotCreateRequest;
import com.sportbooking.api.dto.request.fields.FieldPriceSlotUpdateRequest;
import com.sportbooking.api.dto.response.fields.FieldPriceSlotResponse;
import com.sportbooking.api.dto.response.fields.PriceResponse;
import com.sportbooking.api.service.fields.FieldPriceSlotService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequestMapping()
@Slf4j
public class FieldPriceSlotController {

    FieldPriceSlotService service;

    // ───────────── CRUD PRICE SLOT ─────────────

    @PostMapping("/price-slots") // tạo mới khung giá
    ApiResponse<FieldPriceSlotResponse> create(@RequestBody FieldPriceSlotCreateRequest request) {
        return ApiResponse.<FieldPriceSlotResponse>builder()
                .result(service.createSlot(request))
                .build();
    }

    @PutMapping("/price-slots/{id}") // cập nhật khung giá (có thể thay đổi cả time range, date range, day of week,
                                     // priority)
    ApiResponse<FieldPriceSlotResponse> update(
            @PathVariable String id,
            @RequestBody FieldPriceSlotUpdateRequest request) {
        return ApiResponse.<FieldPriceSlotResponse>builder()
                .result(service.updateSlot(id, request))
                .build();
    }

    @DeleteMapping("/price-slots/{id}") // xóa khung giá
    ApiResponse<String> delete(@PathVariable String id) {
        return ApiResponse.<String>builder()
                .result(service.deleteSlot(id))
                .build();
    }

    @GetMapping("/fields/{fieldId}/price-slots") // lấy tất cả khung giá của sân
    ApiResponse<List<FieldPriceSlotResponse>> getByField(@PathVariable String fieldId) {
        return ApiResponse.<List<FieldPriceSlotResponse>>builder()
                .result(service.getSlotsByFieldId(fieldId))
                .build();
    }

    // ───────────── PRICING ENGINE ─────────────

    @GetMapping("/fields/{fieldId}/price") // tính giá cho sân trong khoảng thời gian nhất định
    ApiResponse<PriceResponse> calculatePrice(
            @PathVariable String fieldId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {

        return ApiResponse.<PriceResponse>builder()
                .result(service.calculatePrice(fieldId, start, end))
                .build();
    }
}