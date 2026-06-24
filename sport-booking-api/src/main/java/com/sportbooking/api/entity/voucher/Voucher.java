package com.sportbooking.api.entity.voucher;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import com.sportbooking.api.common.enums.DiscountType;
import com.sportbooking.api.common.enums.Status;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "vouchers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Voucher {

    @Id
    @UuidGenerator
    @Column(length = 36)
    String id;

    @Column(nullable = false, unique = true, length = 50)
    String code;

    @Column(length = 255)
    String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false)
    DiscountType discountType;

    @Column(name = "discount_value", nullable = false, precision = 12, scale = 2)
    BigDecimal discountValue;

    @Column(name = "min_order", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    BigDecimal minOrder = BigDecimal.ZERO;

    @Column(name = "max_discount", precision = 12, scale = 2)
    BigDecimal maxDiscount;

    @Column(name = "usage_limit")
    Integer usageLimit;

    @Column(name = "used_count", nullable = false)
    @Builder.Default
    Integer usedCount = 0;

    @Column(name = "start_date")
    LocalDateTime startDate;

    @Column(name = "end_date")
    LocalDateTime endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    Status status = Status.ACTIVE;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    LocalDateTime createdAt;
}
