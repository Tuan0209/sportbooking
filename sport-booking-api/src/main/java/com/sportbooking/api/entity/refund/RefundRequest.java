package com.sportbooking.api.entity.refund;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import com.sportbooking.api.common.enums.RefundMethod;
import com.sportbooking.api.common.enums.RefundStatus;
import com.sportbooking.api.entity.booking.Booking;
import com.sportbooking.api.entity.payment.Payment;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "refund_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RefundRequest {

    @Id
    @UuidGenerator
    @Column(length = 36)
    String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id", nullable = false)
    Payment payment;

    @Column(name = "refund_amount", nullable = false, precision = 12, scale = 2)
    BigDecimal refundAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "refund_method", nullable = false)
    RefundMethod refundMethod;

    @Column(name = "bank_name", length = 100)
    String bankName;

    @Column(name = "bank_account", length = 50)
    String bankAccount;

    @Column(name = "bank_account_name", length = 100)
    String bankAccountName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    RefundStatus status = RefundStatus.REQUESTED;

    @Column(name = "admin_id", length = 36)
    String adminId;

    @Column(name = "proof_image", length = 255)
    String proofImage;

    @Column(name = "transaction_code", length = 100)
    String transactionCode;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    LocalDateTime createdAt;

    @Column(name = "completed_at")
    LocalDateTime completedAt;
}
