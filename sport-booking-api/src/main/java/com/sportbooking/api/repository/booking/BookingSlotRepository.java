package com.sportbooking.api.repository.booking;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

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

    // Tất cả khung giờ đã đặt của các sân thuộc 1 cơ sở trong 1 ngày
    List<BookingSlot> findByField_Venue_IdAndBookingDate(
            String venueId,
            LocalDate bookingDate);

    // Giải phóng slot khi booking bị hủy / từ chối để mở lại sân
    void deleteByBooking_Id(String bookingId);

    // Khung giờ thuộc 1 đơn (để hiển thị chi tiết đặt sân)
    List<BookingSlot> findByBooking_Id(String bookingId);
}