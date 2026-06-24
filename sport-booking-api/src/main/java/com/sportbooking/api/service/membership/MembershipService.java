package com.sportbooking.api.service.membership;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sportbooking.api.common.enums.ErrorCode;
import com.sportbooking.api.common.enums.MembershipStatus;
import com.sportbooking.api.common.enums.Status;
import com.sportbooking.api.common.enums.WalletTransactionType;
import com.sportbooking.api.common.exception.AppException;
import com.sportbooking.api.dto.request.membership.MembershipPlanRequest;
import com.sportbooking.api.dto.response.membership.MembershipPlanResponse;
import com.sportbooking.api.dto.response.membership.UserMembershipResponse;
import com.sportbooking.api.entity.membership.MembershipPlan;
import com.sportbooking.api.entity.membership.UserMembership;
import com.sportbooking.api.entity.user.User;
import com.sportbooking.api.entity.wallet.WalletTransaction;
import com.sportbooking.api.repository.membership.MembershipPlanRepository;
import com.sportbooking.api.repository.membership.UserMembershipRepository;
import com.sportbooking.api.repository.user.UserRepository;
import com.sportbooking.api.repository.wallet.WalletTransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MembershipService {

    private final MembershipPlanRepository planRepository;
    private final UserMembershipRepository userMembershipRepository;
    private final UserRepository userRepository;
    private final WalletTransactionRepository walletTransactionRepository;

    public List<MembershipPlanResponse> listActivePlans() {
        return planRepository.findByStatusOrderByPriceAsc(Status.ACTIVE)
                .stream().map(this::toPlanResponse).toList();
    }

    public List<MembershipPlanResponse> listAllPlans() {
        return planRepository.findAllByOrderByPriceAsc()
                .stream().map(this::toPlanResponse).toList();
    }

    /** Mua gói thành viên — thanh toán bằng coin. */
    @Transactional
    public UserMembershipResponse buy(String userId, String planId) {
        MembershipPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new AppException(ErrorCode.PLAN_NOT_FOUND));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (user.getCoinBalance().compareTo(plan.getPrice()) < 0) {
            throw new AppException(ErrorCode.INSUFFICIENT_COINS);
        }

        BigDecimal newBalance = user.getCoinBalance().subtract(plan.getPrice());
        user.setCoinBalance(newBalance);
        userRepository.save(user);

        walletTransactionRepository.save(WalletTransaction.builder()
                .userId(userId)
                .amount(plan.getPrice())
                .type(WalletTransactionType.SUBTRACT)
                .reason("Mua gói thành viên " + plan.getName())
                .balanceAfter(newBalance)
                .build());

        LocalDateTime now = LocalDateTime.now();
        UserMembership um = UserMembership.builder()
                .userId(userId)
                .planId(planId)
                .startDate(now)
                .endDate(now.plusDays(plan.getDurationDays()))
                .status(MembershipStatus.ACTIVE)
                .build();
        userMembershipRepository.save(um);

        return toUserResponse(um, plan);
    }

    public UserMembershipResponse myMembership(String userId) {
        return userMembershipRepository
                .findFirstByUserIdAndStatusAndEndDateAfterOrderByEndDateDesc(
                        userId, MembershipStatus.ACTIVE, LocalDateTime.now())
                .map(um -> {
                    MembershipPlan plan = planRepository.findById(um.getPlanId()).orElse(null);
                    return toUserResponse(um, plan);
                })
                .orElse(null);
    }

    /* ============ Admin ============ */

    @Transactional
    public MembershipPlanResponse create(MembershipPlanRequest req) {
        MembershipPlan p = MembershipPlan.builder()
                .name(req.getName())
                .description(req.getDescription())
                .price(req.getPrice())
                .durationDays(req.getDurationDays())
                .discountPercent(req.getDiscountPercent() != null ? req.getDiscountPercent() : 0)
                .benefits(req.getBenefits())
                .status(req.getStatus() != null ? req.getStatus() : Status.ACTIVE)
                .build();
        return toPlanResponse(planRepository.save(p));
    }

    @Transactional
    public MembershipPlanResponse update(String id, MembershipPlanRequest req) {
        MembershipPlan p = planRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PLAN_NOT_FOUND));
        if (req.getName() != null) p.setName(req.getName());
        p.setDescription(req.getDescription());
        if (req.getPrice() != null) p.setPrice(req.getPrice());
        if (req.getDurationDays() != null) p.setDurationDays(req.getDurationDays());
        if (req.getDiscountPercent() != null) p.setDiscountPercent(req.getDiscountPercent());
        p.setBenefits(req.getBenefits());
        if (req.getStatus() != null) p.setStatus(req.getStatus());
        return toPlanResponse(planRepository.save(p));
    }

    @Transactional
    public void delete(String id) {
        planRepository.deleteById(id);
    }

    private MembershipPlanResponse toPlanResponse(MembershipPlan p) {
        List<String> benefits = (p.getBenefits() == null || p.getBenefits().isBlank())
                ? List.of()
                : Arrays.stream(p.getBenefits().split("\\|")).map(String::trim).toList();
        return MembershipPlanResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .price(p.getPrice())
                .durationDays(p.getDurationDays())
                .discountPercent(p.getDiscountPercent())
                .benefits(benefits)
                .status(p.getStatus().name())
                .build();
    }

    private UserMembershipResponse toUserResponse(UserMembership um, MembershipPlan plan) {
        return UserMembershipResponse.builder()
                .id(um.getId())
                .planName(plan != null ? plan.getName() : null)
                .discountPercent(plan != null ? plan.getDiscountPercent() : 0)
                .startDate(um.getStartDate())
                .endDate(um.getEndDate())
                .status(um.getStatus().name())
                .build();
    }
}
