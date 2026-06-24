package com.sportbooking.api.entity.membership;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import com.sportbooking.api.common.enums.Status;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "membership_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MembershipPlan {

    @Id
    @UuidGenerator
    @Column(length = 36)
    String id;

    @Column(nullable = false, length = 100)
    String name;

    @Column(length = 500)
    String description;

    @Column(nullable = false, precision = 12, scale = 2)
    BigDecimal price;

    @Column(name = "duration_days", nullable = false)
    Integer durationDays;

    @Column(name = "discount_percent", nullable = false)
    @Builder.Default
    Integer discountPercent = 0;

    // các quyền lợi, ngăn cách bằng dấu |
    @Column(columnDefinition = "TEXT")
    String benefits;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    Status status = Status.ACTIVE;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    LocalDateTime createdAt;
}
