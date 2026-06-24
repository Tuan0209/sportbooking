package com.sportbooking.api.service.booking;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.YearMonth;
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
import com.sportbooking.api.dto.request.booking.CreateMonthlyBookingRequest;
import com.sportbooking.api.dto.response.booking.AdminBookingResponse;
import com.sportbooking.api.dto.response.booking.BookedSlotResponse;
import com.sportbooking.api.dto.response.booking.BookingResponse;
import com.sportbooking.api.dto.response.booking.MonthlyBookingResponse;
import com.sportbooking.api.dto.response.booking.MyBookingResponse;
import com.sportbooking.api.entity.booking.Booking;
import com.sportbooking.api.entity.booking.BookingSlot;
import com.sportbooking.api.entity.fields.Field;
import com.sportbooking.api.entity.user.User;
import com.sportbooking.api.repository.booking.BookingRepository;
import com.sportbooking.api.repository.booking.BookingSlotRepository;
import com.sportbooking.api.repository.fields.FieldRepository;
import com.sportbooking.api.repository.user.UserRepository;
import com.sportbooking.api.repository.payment.PaymentRepository;
import com.sportbooking.api.repository.refund.RefundRequestRepository;
import com.sportbooking.api.common.enums.PaymentStatus;
import com.sportbooking.api.common.enums.RefundStatus;
import com.sportbooking.api.entity.payment.Payment;
import com.sportbooking.api.service.payment.PaymentService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingSlotRepository bookingSlotRepository;
    private final FieldRepository fieldRepository;
    private final UserRepository userRepository;
    private final PaymentService paymentService;
    private final PaymentRepository paymentRepository;
    private final RefundRequestRepository refundRequestRepository;

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

        BigDecimal totalHours = BigDecimal
                .valueOf((long) request.getSlots().size() * field.getSlotInterval())
                .divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);

        List<LocalTime> sortedStarts = request.getSlots().stream()
                .map(LocalTime::parse).sorted().toList();
        LocalTime bookingStart = sortedStarts.get(0);
        LocalTime bookingEnd = sortedStarts.get(sortedStarts.size() - 1)
                .plusMinutes(field.getSlotInterval());

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
                .startTime(bookingStart)
                .endTime(bookingEnd)
                .note(request.getNote())
                .totalHours(totalHours)
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

        // Tạo bản ghi thanh toán tương ứng phương thức
        String paymentId = null;
        if (paymentMethod == PaymentMethod.BANK_QR || paymentMethod == PaymentMethod.PAYOS) {
            // Chuyển khoản QR / PayOS: thanh toán PENDING (chờ xác nhận)
            Payment payment = paymentService.createForBooking(booking, paymentMethod);
            paymentId = payment.getId();
        } else if (paymentMethod == PaymentMethod.COIN) {
            // Trả bằng coin: đã thanh toán ngay -> tạo payment PAID để có thể hoàn tiền
            Payment payment = paymentService.createCoinPaid(booking);
            paymentId = payment.getId();
        }

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
                .paymentId(paymentId)
                .build();
    }

    /** Danh sách sân đã đặt của người dùng hiện tại (kèm trạng thái thanh toán & có thể hoàn tiền). */
    public List<MyBookingResponse> getMyBookings(Authentication authentication) {
        String userId = authentication.getName();
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(b -> {
                    Payment payment = paymentRepository.findByBookingId(b.getId()).orElse(null);
                    String paymentStatus = payment != null ? payment.getStatus().name() : null;

                    boolean alreadyRefunding = refundRequestRepository.existsByBookingIdAndStatusIn(
                            b.getId(),
                            List.of(RefundStatus.REQUESTED, RefundStatus.APPROVED, RefundStatus.DONE));

                    boolean refundable = b.getStatus() == BookingStatus.CONFIRMED
                            && payment != null
                            && payment.getStatus() == PaymentStatus.PAID
                            && !alreadyRefunding;

                    return MyBookingResponse.builder()
                            .id(b.getId())
                            .bookingCode(b.getBookingCode())
                            .fieldName(b.getField().getName())
                            .venueName(b.getField().getVenue().getName())
                            .bookingDate(b.getBookingDate())
                            .totalPrice(b.getTotalPrice())
                            .status(b.getStatus().name())
                            .paymentStatus(paymentStatus)
                            .refundable(refundable)
                            .build();
                })
                .toList();
    }

    /** [ADMIN] Danh sách tất cả lịch đặt, lọc theo trạng thái (tuỳ chọn). */
    public List<AdminBookingResponse> adminList(String statusFilter) {
        return bookingRepository.findAllByOrderByCreatedAtDesc().stream()
                .filter(b -> statusFilter == null || statusFilter.isBlank()
                        || b.getStatus().name().equals(statusFilter))
                .map(b -> AdminBookingResponse.builder()
                        .id(b.getId())
                        .bookingCode(b.getBookingCode())
                        .customerName(b.getCustomerName())
                        .customerPhone(b.getCustomerPhone())
                        .fieldName(b.getField().getName())
                        .venueName(b.getField().getVenue().getName())
                        .bookingDate(b.getBookingDate())
                        .startTime(b.getStartTime())
                        .endTime(b.getEndTime())
                        .totalPrice(b.getTotalPrice())
                        .status(b.getStatus().name())
                        .createdAt(b.getCreatedAt())
                        .build())
                .toList();
    }

    /** [ADMIN] Đổi trạng thái lịch đặt (CONFIRMED / COMPLETED / CANCELED). */
    @Transactional
    public AdminBookingResponse adminUpdateStatus(String bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));
        BookingStatus newStatus;
        try {
            newStatus = BookingStatus.valueOf(status);
        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }
        booking.setStatus(newStatus);
        if (newStatus == BookingStatus.CANCELED) {
            booking.setCanceledAt(java.time.LocalDateTime.now());
            booking.setCancelReason("Admin huỷ");
        }
        bookingRepository.save(booking);
        return AdminBookingResponse.builder()
                .id(booking.getId())
                .bookingCode(booking.getBookingCode())
                .customerName(booking.getCustomerName())
                .customerPhone(booking.getCustomerPhone())
                .fieldName(booking.getField().getName())
                .venueName(booking.getField().getVenue().getName())
                .bookingDate(booking.getBookingDate())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus().name())
                .createdAt(booking.getCreatedAt())
                .build();
    }

    /** Lấy danh sách khung giờ đã đặt của các sân thuộc 1 cơ sở trong 1 ngày. */
    public List<BookedSlotResponse> getBookedSlots(String venueId, String date) {
        LocalDate bookingDate = LocalDate.parse(date);
        return bookingSlotRepository
                .findByField_Venue_IdAndBookingDate(venueId, bookingDate)
                .stream()
                .map(bs -> BookedSlotResponse.builder()
                        .fieldId(bs.getField().getId())
                        .startTime(bs.getStartTime().toString().substring(0, 5))
                        .build())
                .toList();
    }

    /** Tạo vé tháng: lặp các khung giờ theo thứ trong tuần cho cả tháng, bỏ qua ngày trùng. */
    @Transactional
    public MonthlyBookingResponse createMonthly(
            CreateMonthlyBookingRequest request,
            Authentication authentication) {

        String userId = authentication.getName();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Field field = fieldRepository.findById(request.getFieldId())
                .orElseThrow(() -> new AppException(ErrorCode.FIELD_NOT_FOUND));

        YearMonth ym = YearMonth.of(request.getYear(), request.getMonth());
        LocalDate today = LocalDate.now();

        BigDecimal pricePerDay = request.getPricePerDay() != null
                ? request.getPricePerDay()
                : BigDecimal.ZERO;

        // Khung giờ áp dụng cho mọi buổi (giống nhau mỗi ngày)
        List<LocalTime> sortedStarts = request.getSlots().stream()
                .map(LocalTime::parse).sorted().toList();
        LocalTime bookingStart = sortedStarts.get(0);
        LocalTime bookingEnd = sortedStarts.get(sortedStarts.size() - 1)
                .plusMinutes(field.getSlotInterval());
        BigDecimal totalHours = BigDecimal
                .valueOf((long) request.getSlots().size() * field.getSlotInterval())
                .divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);

        List<String> createdDates = new ArrayList<>();
        List<String> skippedDates = new ArrayList<>();
        BigDecimal totalPrice = BigDecimal.ZERO;

        for (int day = 1; day <= ym.lengthOfMonth(); day++) {
            LocalDate date = ym.atDay(day);

            // bỏ ngày quá khứ và ngày không khớp thứ đã chọn
            if (date.isBefore(today)) {
                continue;
            }
            if (!request.getDaysOfWeek().contains(date.getDayOfWeek().getValue())) {
                continue;
            }

            // nếu bất kỳ khung giờ nào trong ngày đã bị đặt -> bỏ qua cả ngày
            boolean conflict = false;
            for (String slot : request.getSlots()) {
                LocalTime start = LocalTime.parse(slot);
                if (bookingSlotRepository.existsByFieldIdAndBookingDateAndStartTime(
                        field.getId(), date, start)) {
                    conflict = true;
                    break;
                }
            }
            if (conflict) {
                skippedDates.add(date.toString());
                continue;
            }

            Booking booking = Booking.builder()
                    .bookingCode("BK-" + UUID.randomUUID()
                            .toString().substring(0, 8).toUpperCase())
                    .field(field)
                    .user(user)
                    .bookingDate(date)
                    .customerName(request.getCustomerName())
                    .customerPhone(request.getCustomerPhone())
                    .startTime(bookingStart)
                    .endTime(bookingEnd)
                    .note(request.getNote())
                    .totalHours(totalHours)
                    .totalPrice(pricePerDay)
                    .status(BookingStatus.CONFIRMED)
                    .build();

            bookingRepository.save(booking);

            List<BookingSlot> bookingSlots = new ArrayList<>();
            for (String slot : request.getSlots()) {
                LocalTime start = LocalTime.parse(slot);
                LocalTime end = start.plusMinutes(field.getSlotInterval());
                bookingSlots.add(BookingSlot.builder()
                        .booking(booking)
                        .field(field)
                        .bookingDate(date)
                        .startTime(start)
                        .endTime(end)
                        .build());
            }
            bookingSlotRepository.saveAll(bookingSlots);

            createdDates.add(date.toString());
            totalPrice = totalPrice.add(pricePerDay);
        }

        return MonthlyBookingResponse.builder()
                .createdCount(createdDates.size())
                .totalPrice(totalPrice)
                .createdDates(createdDates)
                .skippedDates(skippedDates)
                .build();
    }
}
