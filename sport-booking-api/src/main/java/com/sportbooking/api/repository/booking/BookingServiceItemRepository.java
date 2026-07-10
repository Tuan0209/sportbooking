package com.sportbooking.api.repository.booking;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sportbooking.api.entity.booking.BookingServiceItem;

@Repository
public interface BookingServiceItemRepository
        extends JpaRepository<BookingServiceItem, String> {

    List<BookingServiceItem> findByBooking_Id(String bookingId);
}
