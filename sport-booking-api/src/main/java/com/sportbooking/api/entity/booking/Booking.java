package com.sportbooking.api.entity.booking;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import com.sportbooking.api.common.enums.BookingStatus;
import com.sportbooking.api.entity.fields.Field;
import com.sportbooking.api.entity.user.User;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Booking {

    @Id
    @UuidGenerator
    String id;

    @Column(name = "booking_code", nullable = false, unique = true)
    String bookingCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "field_id", nullable = false)
    Field field;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @Column(name = "booking_date", nullable = false)
    LocalDate bookingDate;

    @Column(name = "customer_name", nullable = false)
    String customerName;

    @Column(name = "customer_phone", nullable = false)
    String customerPhone;

    @Column(name = "start_time")
    LocalTime startTime;

    @Column(name = "end_time")
    LocalTime endTime;

    @Column(columnDefinition = "TEXT")
    String note;

    @Column(name = "total_hours", precision = 5, scale = 2)
    BigDecimal totalHours;

    @Column(name = "total_price", nullable = false, precision = 12, scale = 2)
    BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    BookingStatus status;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    List<BookingSlot> slots;

    @Column(name = "canceled_at")
    LocalDateTime canceledAt;

    @Column(name = "cancel_reason")
    String cancelReason;

    @CreationTimestamp
    @Column(name = "created_at")
    LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    LocalDateTime updatedAt;
    @Column(name = "monthly_group", length = 50)
    private String monthlyGroup;

}