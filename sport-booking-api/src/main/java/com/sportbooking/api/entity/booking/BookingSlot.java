package com.sportbooking.api.entity.booking;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import com.sportbooking.api.entity.fields.Field;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "booking_slots", uniqueConstraints = {
                @UniqueConstraint(name = "uk_field_slot", columnNames = {
                                "field_id",
                                "booking_date",
                                "start_time"
                })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingSlot {

        @Id
        @UuidGenerator
        String id;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "booking_id")
        Booking booking;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "field_id")
        Field field;

        LocalDate bookingDate;

        LocalTime startTime;

        LocalTime endTime;

        @CreationTimestamp
        LocalDateTime createdAt;
}