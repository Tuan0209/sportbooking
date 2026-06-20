package com.sportbooking.api.service.booking;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sportbooking.api.common.enums.BookingStatus;
import com.sportbooking.api.common.enums.ErrorCode;
import com.sportbooking.api.common.enums.PaymentMethod;
import com.sportbooking.api.common.exception.AppException;
import com.sportbooking.api.dto.request.booking.CreateBookingRequest;
import com.sportbooking.api.dto.response.booking.BookingResponse;
import com.sportbooking.api.entity.booking.Booking;
import com.sportbooking.api.entity.booking.BookingSlot;
import com.sportbooking.api.entity.fields.Field;
import com.sportbooking.api.entity.user.User;
import com.sportbooking.api.repository.booking.BookingRepository;
import com.sportbooking.api.repository.booking.BookingSlotRepository;
import com.sportbooking.api.repository.fields.FieldRepository;
import com.sportbooking.api.repository.user.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingSlotRepository bookingSlotRepository;
    private final FieldRepository fieldRepository;
    private final UserRepository userRepository;

    @Transactional
    public BookingResponse create(
            CreateBookingRequest request,
            Authentication authentication) {

        String userId = authentication.getName();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Field field = fieldRepository.findById(request.getFieldId())
                .orElseThrow(() -> new AppException(ErrorCode.FIELD_NOT_FOUND));

        LocalDate bookingDate = LocalDate.parse(request.getBookingDate());

        for (String slot : request.getSlots()) {

            LocalTime start = LocalTime.parse(slot);

            boolean existed = bookingSlotRepository
                    .existsByFieldIdAndBookingDateAndStartTime(
                            field.getId(),
                            bookingDate,
                            start);

            if (existed) {
                throw new AppException(
                        ErrorCode.SLOT_ALREADY_BOOKED);
            }
        }

        PaymentMethod paymentMethod = request.getPaymentMethod();
        BookingStatus bookingStatus = BookingStatus.PENDING_PAYMENT;

        if (paymentMethod == PaymentMethod.COIN) {
            if (user.getCoinBalance().compareTo(request.getTotalPrice()) < 0) {
                throw new AppException(ErrorCode.INSUFFICIENT_COINS);
            }
            user.setCoinBalance(user.getCoinBalance().subtract(request.getTotalPrice()));
            userRepository.save(user);
            bookingStatus = BookingStatus.CONFIRMED;
        }

        Booking booking = Booking.builder()
                .bookingCode(
                        "BK-" +
                                UUID.randomUUID()
                                        .toString()
                                        .substring(0, 8)
                                        .toUpperCase())
                .field(field)
                .user(user)
                .bookingDate(bookingDate)
                .customerName(request.getCustomerName())
                .customerPhone(request.getCustomerPhone())
                .note(request.getNote())
                .totalPrice(request.getTotalPrice())
                .status(bookingStatus)
                .build();

        bookingRepository.save(booking);

        List<BookingSlot> bookingSlots = new ArrayList<>();

        for (String slot : request.getSlots()) {

            LocalTime start = LocalTime.parse(slot);

            LocalTime end = start.plusMinutes(
                    field.getSlotInterval());

            bookingSlots.add(
                    BookingSlot.builder()
                            .booking(booking)
                            .field(field)
                            .bookingDate(bookingDate)
                            .startTime(start)
                            .endTime(end)
                            .build());
        }

        bookingSlotRepository.saveAll(bookingSlots);

        return BookingResponse.builder()
                .id(booking.getId())
                .bookingCode(
                        booking.getBookingCode())
                .fieldName(field.getName())
                .bookingDate(bookingDate)
                .slots(request.getSlots())
                .totalPrice(
                        booking.getTotalPrice())
                .status(
                        booking.getStatus().name())
                .build();
    }
}
