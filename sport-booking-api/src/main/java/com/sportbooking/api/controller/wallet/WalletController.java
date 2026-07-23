package com.sportbooking.api.controller.wallet;

import java.math.BigDecimal;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.sportbooking.api.common.ApiResponse;
import com.sportbooking.api.dto.response.wallet.WalletResponse;
import com.sportbooking.api.service.wallet.WalletService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @GetMapping
    public ApiResponse<WalletResponse> myWallet(Authentication authentication) {
        return ApiResponse.<WalletResponse>builder()
                .code(0)
                .result(walletService.getWallet(authentication.getName()))
                .build();
    }

    // @PostMapping("/topup")
    // public ApiResponse<WalletResponse> topUp(
    // @RequestBody Map<String, Object> body,
    // Authentication authentication) {
    // BigDecimal amount = new BigDecimal(String.valueOf(body.getOrDefault("amount",
    // "0")));
    // return ApiResponse.<WalletResponse>builder()
    // .code(0)
    // .result(walletService.topUp(authentication.getName(), amount))
    // .build();
    // }
    @PostMapping("/topup/create")
    public ApiResponse<Map<String, String>> create(
            @RequestBody Map<String, Object> body,
            Authentication authentication) {

        BigDecimal amount = new BigDecimal(body.get("amount").toString());

        String url = walletService.createTopupPayment(
                authentication.getName(),
                amount);

        return ApiResponse.<Map<String, String>>builder()
                .code(0)
                .result(Map.of(
                        "checkoutUrl", url))
                .build();
    }

    @GetMapping("/topup/success")
    public ApiResponse<WalletResponse> success(
            @RequestParam BigDecimal amount,
            Authentication authentication) {

        return ApiResponse.<WalletResponse>builder()
                .code(0)
                .result(walletService.topupSuccess(
                        authentication.getName(),
                        amount))
                .build();
    }
}
