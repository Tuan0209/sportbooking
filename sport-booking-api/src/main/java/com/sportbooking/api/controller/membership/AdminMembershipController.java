package com.sportbooking.api.controller.membership;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.sportbooking.api.common.ApiResponse;
import com.sportbooking.api.dto.request.membership.MembershipPlanRequest;
import com.sportbooking.api.dto.response.membership.MembershipPlanResponse;
import com.sportbooking.api.service.membership.MembershipService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/membership-plans")
@RequiredArgsConstructor
public class AdminMembershipController {

    private final MembershipService membershipService;

    @GetMapping
    public ApiResponse<List<MembershipPlanResponse>> list() {
        return ApiResponse.<List<MembershipPlanResponse>>builder().code(0)
                .result(membershipService.listAllPlans()).build();
    }

    @PostMapping
    public ApiResponse<MembershipPlanResponse> create(@RequestBody MembershipPlanRequest req) {
        return ApiResponse.<MembershipPlanResponse>builder().code(0)
                .result(membershipService.create(req)).build();
    }

    @PutMapping("/{id}")
    public ApiResponse<MembershipPlanResponse> update(@PathVariable String id, @RequestBody MembershipPlanRequest req) {
        return ApiResponse.<MembershipPlanResponse>builder().code(0)
                .result(membershipService.update(id, req)).build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable String id) {
        membershipService.delete(id);
        return ApiResponse.<String>builder().code(0).result("Đã xoá").build();
    }
}
