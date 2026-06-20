package com.sportbooking.api.repository.booking;

import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.sportbooking.api.entity.booking.BookingSlot;

@Repository
public interface BookingSlotRepository
        extends JpaRepository<BookingSlot, String> {

    boolean existsByFieldIdAndBookingDateAndStartTime(
            String fieldId,
            LocalDate bookingDate,
            LocalTime startTime);
}