package com.sportbooking.api.entity.wallet;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import com.sportbooking.api.common.enums.WalletTransactionType;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "wallet_transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WalletTransaction {

    @Id
    @UuidGenerator
    @Column(length = 36)
    String id;

    @Column(name = "user_id", nullable = false, length = 36)
    String userId;

    @Column(nullable = false, precision = 12, scale = 2)
    BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    WalletTransactionType type;

    @Column(nullable = false, length = 255)
    String reason;

    @Column(name = "related_booking_id", length = 36)
    String relatedBookingId;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    LocalDateTime createdAt;

    @Column(name = "balance_after", precision = 12, scale = 2)
    BigDecimal balanceAfter;
}
