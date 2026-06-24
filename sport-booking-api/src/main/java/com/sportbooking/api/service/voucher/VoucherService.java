package com.sportbooking.api.service.voucher;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sportbooking.api.common.enums.DiscountType;
import com.sportbooking.api.common.enums.ErrorCode;
import com.sportbooking.api.common.enums.Status;
import com.sportbooking.api.common.exception.AppException;
import com.sportbooking.api.dto.request.voucher.VoucherRequest;
import com.sportbooking.api.dto.response.voucher.ApplyVoucherResponse;
import com.sportbooking.api.dto.response.voucher.VoucherResponse;
import com.sportbooking.api.entity.voucher.Voucher;
import com.sportbooking.api.repository.voucher.VoucherRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VoucherService {

    private final VoucherRepository voucherRepository;

    /** Áp mã giảm giá cho 1 số tiền đơn hàng. */
    public ApplyVoucherResponse apply(String code, BigDecimal amount) {
        if (code == null || code.isBlank()) {
            throw new AppException(ErrorCode.VOUCHER_INVALID);
        }
        Voucher v = voucherRepository.findByCodeIgnoreCase(code.trim())
                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_INVALID));

        LocalDateTime now = LocalDateTime.now();
        if (v.getStatus() != Status.ACTIVE
                || (v.getStartDate() != null && now.isBefore(v.getStartDate()))
                || (v.getEndDate() != null && now.isAfter(v.getEndDate()))) {
            throw new AppException(ErrorCode.VOUCHER_INVALID);
        }
        if (v.getUsageLimit() != null && v.getUsedCount() >= v.getUsageLimit()) {
            throw new AppException(ErrorCode.VOUCHER_INVALID);
        }
        if (amount == null) amount = BigDecimal.ZERO;
        if (amount.compareTo(v.getMinOrder()) < 0) {
            throw new AppException(ErrorCode.VOUCHER_MIN_ORDER);
        }

        BigDecimal discount;
        if (v.getDiscountType() == DiscountType.PERCENT) {
            discount = amount.multiply(v.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP);
            if (v.getMaxDiscount() != null && discount.compareTo(v.getMaxDiscount()) > 0) {
                discount = v.getMaxDiscount();
            }
        } else {
            discount = v.getDiscountValue();
        }
        if (discount.compareTo(amount) > 0) discount = amount;

        return ApplyVoucherResponse.builder()
                .code(v.getCode())
                .discount(discount)
                .finalAmount(amount.subtract(discount))
                .message("Áp dụng mã thành công")
                .build();
    }

    /* ============ Admin CRUD ============ */

    public List<VoucherResponse> listAll() {
        return voucherRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public VoucherResponse create(VoucherRequest req) {
        Voucher v = Voucher.builder()
                .code(req.getCode())
                .description(req.getDescription())
                .discountType(req.getDiscountType())
                .discountValue(req.getDiscountValue())
                .minOrder(req.getMinOrder() != null ? req.getMinOrder() : BigDecimal.ZERO)
                .maxDiscount(req.getMaxDiscount())
                .usageLimit(req.getUsageLimit())
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .status(req.getStatus() != null ? req.getStatus() : Status.ACTIVE)
                .build();
        return toResponse(voucherRepository.save(v));
    }

    @Transactional
    public VoucherResponse update(String id, VoucherRequest req) {
        Voucher v = voucherRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_INVALID));
        if (req.getCode() != null) v.setCode(req.getCode());
        v.setDescription(req.getDescription());
        if (req.getDiscountType() != null) v.setDiscountType(req.getDiscountType());
        if (req.getDiscountValue() != null) v.setDiscountValue(req.getDiscountValue());
        if (req.getMinOrder() != null) v.setMinOrder(req.getMinOrder());
        v.setMaxDiscount(req.getMaxDiscount());
        v.setUsageLimit(req.getUsageLimit());
        v.setStartDate(req.getStartDate());
        v.setEndDate(req.getEndDate());
        if (req.getStatus() != null) v.setStatus(req.getStatus());
        return toResponse(voucherRepository.save(v));
    }

    @Transactional
    public void delete(String id) {
        voucherRepository.deleteById(id);
    }

    private VoucherResponse toResponse(Voucher v) {
        return VoucherResponse.builder()
                .id(v.getId())
                .code(v.getCode())
                .description(v.getDescription())
                .discountType(v.getDiscountType().name())
                .discountValue(v.getDiscountValue())
                .minOrder(v.getMinOrder())
                .maxDiscount(v.getMaxDiscount())
                .usageLimit(v.getUsageLimit())
                .usedCount(v.getUsedCount())
                .startDate(v.getStartDate())
                .endDate(v.getEndDate())
                .status(v.getStatus().name())
                .build();
    }
}
