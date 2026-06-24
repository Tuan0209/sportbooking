package com.sportbooking.api.entity.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import com.sportbooking.api.common.enums.Status;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

/** Dịch vụ kèm theo sân (nước uống, thuê vợt, trọng tài...). Map bảng services. */
@Entity
@Table(name = "services")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceItem {

    @Id
    @UuidGenerator
    @Column(length = 36)
    String id;

    @Column(nullable = false, length = 100)
    String name;

    @Column(nullable = false, precision = 10, scale = 2)
    BigDecimal price;

    @Column(nullable = false, length = 50)
    String unit;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    Status status = Status.ACTIVE;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    LocalDateTime updatedAt;
}
