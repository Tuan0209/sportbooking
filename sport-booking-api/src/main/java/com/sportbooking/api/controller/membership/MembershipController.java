package com.sportbooking.api.controller.membership;

import java.util.List;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.sportbooking.api.common.ApiResponse;
import com.sportbooking.api.dto.response.membership.MembershipPlanResponse;
import com.sportbooking.api.dto.response.membership.UserMembershipResponse;
import com.sportbooking.api.service.membership.MembershipService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/membership")
@RequiredArgsConstructor
public class MembershipController {

    private final MembershipService membershipService;

    @GetMapping("/plans")
    public ApiResponse<List<MembershipPlanResponse>> plans() {
        return ApiResponse.<List<MembershipPlanResponse>>builder().code(0)
                .result(membershipService.listActivePlans()).build();
    }

    @GetMapping("/my")
    public ApiResponse<UserMembershipResponse> my(Authentication authentication) {
        return ApiResponse.<UserMembershipResponse>builder().code(0)
                .result(membershipService.myMembership(authentication.getName())).build();
    }

    @PostMapping("/buy")
    public ApiResponse<UserMembershipResponse> buy(
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        return ApiResponse.<UserMembershipResponse>builder().code(0)
                .result(membershipService.buy(authentication.getName(), body.get("planId"))).build();
    }
}
