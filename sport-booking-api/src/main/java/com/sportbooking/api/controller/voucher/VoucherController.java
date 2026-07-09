package com.sportbooking.api.controller.voucher;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

import com.sportbooking.api.common.ApiResponse;
import com.sportbooking.api.dto.response.voucher.ApplyVoucherResponse;
import com.sportbooking.api.dto.response.voucher.VoucherResponse;
import com.sportbooking.api.service.voucher.VoucherService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/vouchers")
@RequiredArgsConstructor
public class VoucherController {

    private final VoucherService voucherService;

    /** Danh sách mã giảm giá đang hoạt động cho người dùng. */
    @GetMapping
    public ApiResponse<List<VoucherResponse>> list() {
        return ApiResponse.<List<VoucherResponse>>builder()
                .code(0)
                .result(voucherService.listActiveForUser())
                .build();
    }

    /** Áp mã giảm giá. body: { code, amount } */
    @PostMapping("/apply")
    public ApiResponse<ApplyVoucherResponse> apply(@RequestBody Map<String, Object> body) {
        String code = String.valueOf(body.getOrDefault("code", ""));
        BigDecimal amount = new BigDecimal(String.valueOf(body.getOrDefault("amount", "0")));
        return ApiResponse.<ApplyVoucherResponse>builder()
                .code(0)
                .result(voucherService.apply(code, amount))
                .build();
    }
}
