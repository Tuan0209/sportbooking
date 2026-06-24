package com.sportbooking.api.service.refund;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sportbooking.api.common.enums.BookingStatus;
import com.sportbooking.api.common.enums.ErrorCode;
import com.sportbooking.api.common.enums.PaymentStatus;
import com.sportbooking.api.common.enums.RefundMethod;
import com.sportbooking.api.common.enums.RefundStatus;
import com.sportbooking.api.common.enums.WalletTransactionType;
import com.sportbooking.api.common.exception.AppException;
import com.sportbooking.api.dto.request.refund.ApproveRefundRequest;
import com.sportbooking.api.dto.request.refund.CreateRefundRequest;
import com.sportbooking.api.dto.response.refund.AdminRefundResponse;
import com.sportbooking.api.entity.booking.Booking;
import com.sportbooking.api.entity.payment.Payment;
import com.sportbooking.api.entity.refund.RefundRequest;
import com.sportbooking.api.entity.user.User;
import com.sportbooking.api.entity.wallet.WalletTransaction;
import com.sportbooking.api.repository.booking.BookingRepository;
import com.sportbooking.api.repository.payment.PaymentRepository;
import com.sportbooking.api.repository.refund.RefundRequestRepository;
import com.sportbooking.api.repository.user.UserRepository;
import com.sportbooking.api.repository.wallet.WalletTransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefundService {

    private final RefundRequestRepository refundRequestRepository;
    private final WalletTransactionRepository walletTransactionRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    /** Người dùng yêu cầu hoàn tiền cho 1 booking đã thanh toán. */
    @Transactional
    public AdminRefundResponse createRequest(String userId, CreateRefundRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        if (!booking.getUser().getId().equals(userId)) {
            throw new AppException(ErrorCode.REFUND_INVALID);
        }

        Payment payment = paymentRepository.findByBookingId(booking.getId())
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));

        if (payment.getStatus() != PaymentStatus.PAID) {
            throw new AppException(ErrorCode.REFUND_INVALID);
        }

        boolean existed = refundRequestRepository.existsByBookingIdAndStatusIn(
                booking.getId(),
                List.of(RefundStatus.REQUESTED, RefundStatus.APPROVED, RefundStatus.DONE));
        if (existed) {
            throw new AppException(ErrorCode.REFUND_INVALID);
        }

        if (request.getRefundMethod() == RefundMethod.BANK_TRANSFER) {
            if (request.getBankAccount() == null || request.getBankAccount().isBlank()) {
                throw new AppException(ErrorCode.REFUND_INVALID);
            }
        }

        RefundRequest refund = RefundRequest.builder()
                .booking(booking)
                .payment(payment)
                .refundAmount(payment.getAmount())
                .refundMethod(request.getRefundMethod())
                .bankName(request.getBankName())
                .bankAccount(request.getBankAccount())
                .bankAccountName(request.getBankAccountName())
                .status(RefundStatus.REQUESTED)
                .build();
        refundRequestRepository.save(refund);

        // Hủy booking khi yêu cầu hoàn tiền
        booking.setStatus(BookingStatus.CANCELED);
        booking.setCanceledAt(LocalDateTime.now());
        booking.setCancelReason("Yêu cầu hoàn tiền");
        bookingRepository.save(booking);

        return toResponse(refund);
    }

    public List<AdminRefundResponse> listForAdmin() {
        return refundRequestRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toResponse).toList();
    }

    /** Admin duyệt và xử lý hoàn tiền. */
    @Transactional
    public AdminRefundResponse approve(String refundId, String adminId, ApproveRefundRequest body) {
        RefundRequest refund = refundRequestRepository.findById(refundId)
                .orElseThrow(() -> new AppException(ErrorCode.REFUND_NOT_FOUND));

        if (refund.getStatus() != RefundStatus.REQUESTED) {
            throw new AppException(ErrorCode.REFUND_INVALID);
        }

        Payment payment = refund.getPayment();

        if (refund.getRefundMethod() == RefundMethod.COIN) {
            // Cộng tiền vào ví người dùng
            User user = refund.getBooking().getUser();
            BigDecimal newBalance = user.getCoinBalance().add(refund.getRefundAmount());
            user.setCoinBalance(newBalance);
            userRepository.save(user);

            walletTransactionRepository.save(WalletTransaction.builder()
                    .userId(user.getId())
                    .amount(refund.getRefundAmount())
                    .type(WalletTransactionType.ADD)
                    .reason("Hoàn tiền đặt sân " + refund.getBooking().getBookingCode())
                    .relatedBookingId(refund.getBooking().getId())
                    .balanceAfter(newBalance)
                    .build());
        } else {
            // Chuyển khoản tay: lưu mã giao dịch + ảnh đã chuyển
            if (body != null) {
                refund.setTransactionCode(body.getTransactionCode());
                refund.setProofImage(body.getProofImage());
            }
        }

        payment.setStatus(PaymentStatus.REFUNDED);
        paymentRepository.save(payment);

        refund.setStatus(RefundStatus.DONE);
        refund.setAdminId(adminId);
        refund.setCompletedAt(LocalDateTime.now());
        refundRequestRepository.save(refund);

        return toResponse(refund);
    }

    @Transactional
    public AdminRefundResponse reject(String refundId, String adminId) {
        RefundRequest refund = refundRequestRepository.findById(refundId)
                .orElseThrow(() -> new AppException(ErrorCode.REFUND_NOT_FOUND));
        if (refund.getStatus() != RefundStatus.REQUESTED) {
            throw new AppException(ErrorCode.REFUND_INVALID);
        }
        refund.setStatus(RefundStatus.REJECTED);
        refund.setAdminId(adminId);
        refund.setCompletedAt(LocalDateTime.now());
        refundRequestRepository.save(refund);
        return toResponse(refund);
    }

    private AdminRefundResponse toResponse(RefundRequest r) {
        Booking b = r.getBooking();
        return AdminRefundResponse.builder()
                .refundId(r.getId())
                .bookingId(b.getId())
                .bookingCode(b.getBookingCode())
                .customerName(b.getCustomerName())
                .customerPhone(b.getCustomerPhone())
                .fieldName(b.getField().getName())
                .refundAmount(r.getRefundAmount())
                .refundMethod(r.getRefundMethod().name())
                .bankName(r.getBankName())
                .bankAccount(r.getBankAccount())
                .bankAccountName(r.getBankAccountName())
                .status(r.getStatus().name())
                .transactionCode(r.getTransactionCode())
                .proofImage(r.getProofImage())
                .createdAt(r.getCreatedAt())
                .completedAt(r.getCompletedAt())
                .build();
    }
}
