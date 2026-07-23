package com.sportbooking.api.repository.booking;

import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.sportbooking.api.entity.booking.Booking;

@Repository
public interface BookingRepository
                extends JpaRepository<Booking, String> {

        List<Booking> findByFieldIdAndBookingDate(
                        String fieldId,
                        LocalDate bookingDate);

        List<Booking> findByUserIdOrderByCreatedAtDesc(String userId);

        List<Booking> findAllByOrderByCreatedAtDesc();

        List<Booking> findByMonthlyGroup(String monthlyGroup);

        long countByBookingDate(LocalDate bookingDate);
}