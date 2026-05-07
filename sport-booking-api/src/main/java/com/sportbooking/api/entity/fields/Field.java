package com.sportbooking.api.entity.fields;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import com.sportbooking.api.common.enums.FieldStatus;
import com.sportbooking.api.entity.areas.Area;
import com.sportbooking.api.entity.venues.Venue;
import com.sportbooking.api.entity.fields.FieldType;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "fields")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Field {

    @Id
    @UuidGenerator
    @Column(length = 36, nullable = false, updatable = false)
    String id;

    @Column(nullable = false)
    String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id", nullable = false)
    Venue venue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "field_type_id", nullable = false)
    FieldType fieldType;

    @Column(name = "price_per_hour", nullable = false, precision = 10, scale = 2)
    BigDecimal pricePerHour;

    @Column(name = "open_time")
    LocalTime openTime;

    @Column(name = "close_time")
    LocalTime closeTime;

    // @Column(precision = 10, scale = 6)
    // BigDecimal latitude;

    // @Column(precision = 10, scale = 6)
    // BigDecimal longitude;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    FieldStatus status = FieldStatus.ACTIVE;

    @OneToMany(mappedBy = "field", cascade = CascadeType.ALL, orphanRemoval = true)
    List<FieldPriceSlot> priceSlots;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    LocalDateTime updatedAt;
    @Column(name = "slot_interval")
    @Builder.Default
    Integer slotInterval = 30;
}