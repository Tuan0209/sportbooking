package com.sportbooking.api.controller.voucher;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.sportbooking.api.common.ApiResponse;
import com.sportbooking.api.dto.request.voucher.VoucherRequest;
import com.sportbooking.api.dto.response.voucher.VoucherResponse;
import com.sportbooking.api.service.voucher.VoucherService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/vouchers")
@RequiredArgsConstructor
public class AdminVoucherController {

    private final VoucherService voucherService;

    @GetMapping
    public ApiResponse<List<VoucherResponse>> list() {
        return ApiResponse.<List<VoucherResponse>>builder().code(0)
                .result(voucherService.listAll()).build();
    }

    @PostMapping
    public ApiResponse<VoucherResponse> create(@RequestBody VoucherRequest req) {
        return ApiResponse.<VoucherResponse>builder().code(0)
                .result(voucherService.create(req)).build();
    }

    @PutMapping("/{id}")
    public ApiResponse<VoucherResponse> update(@PathVariable String id, @RequestBody VoucherRequest req) {
        return ApiResponse.<VoucherResponse>builder().code(0)
                .result(voucherService.update(id, req)).build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable String id) {
        voucherService.delete(id);
        return ApiResponse.<String>builder().code(0).result("Đã xoá").build();
    }
}
