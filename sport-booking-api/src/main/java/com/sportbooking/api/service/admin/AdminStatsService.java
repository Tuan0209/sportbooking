package com.sportbooking.api.service.admin;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.sportbooking.api.common.enums.PaymentStatus;
import com.sportbooking.api.common.enums.RefundStatus;
import com.sportbooking.api.dto.response.admin.AdminStatsResponse;
import com.sportbooking.api.repository.booking.BookingRepository;
import com.sportbooking.api.repository.fields.FieldRepository;
import com.sportbooking.api.repository.payment.PaymentRepository;
import com.sportbooking.api.repository.refund.RefundRequestRepository;
import com.sportbooking.api.repository.user.UserRepository;
import com.sportbooking.api.repository.venues.VenueRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminStatsService {

    private final VenueRepository venueRepository;
    private final FieldRepository fieldRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final RefundRequestRepository refundRequestRepository;

    public AdminStatsResponse getStats() {
        return AdminStatsResponse.builder()
                .totalVenues(venueRepository.count())
                .totalFields(fieldRepository.count())
                .totalUsers(userRepository.count())
                .totalBookings(bookingRepository.count())
                .todayBookings(bookingRepository.countByBookingDate(LocalDate.now()))
                .pendingPayments(paymentRepository.countByStatus(PaymentStatus.PENDING))
                .pendingRefunds(refundRequestRepository.countByStatus(RefundStatus.REQUESTED))
                .totalRevenue(paymentRepository.totalPaidRevenue())
                .build();
    }
}
