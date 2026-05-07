package com.sportbooking.api.entity.fields;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "field_price_slots", indexes = {
        @Index(name = "idx_price_slot_field_id", columnList = "field_id"),
        @Index(name = "idx_price_slot_time", columnList = "start_time, end_time"),
        @Index(name = "idx_price_slot_date", columnList = "start_date, end_date"),
        @Index(name = "idx_price_slot_dow", columnList = "day_of_week")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FieldPriceSlot {

    @Id
    @UuidGenerator
    @Column(length = 36, nullable = false, updatable = false)
    String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "field_id", nullable = false)
    Field field;

    @Column(name = "start_time", nullable = false)
    LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    LocalTime endTime;

    @Column(nullable = false, precision = 10, scale = 2)
    BigDecimal price;

    @Column(name = "start_date")
    LocalDate startDate; // null = no date restriction

    @Column(name = "end_date")
    LocalDate endDate; // null = no date restriction

    @Column(name = "day_of_week")
    Integer dayOfWeek; // null = all days, 0=Sun, 6=Sat

    @Column(nullable = false)
    @Builder.Default
    Integer priority = 0; // cao hon se duoc chon truoc

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    LocalDateTime createdAt;
}