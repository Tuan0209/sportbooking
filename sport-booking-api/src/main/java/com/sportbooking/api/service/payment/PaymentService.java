package com.sportbooking.api.service.payment;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.sportbooking.api.common.enums.BookingStatus;
import com.sportbooking.api.common.enums.ErrorCode;
import com.sportbooking.api.common.enums.PaymentMethod;
import com.sportbooking.api.common.enums.PaymentStatus;
import com.sportbooking.api.common.exception.AppException;
import com.sportbooking.api.dto.response.payment.AdminPaymentResponse;
import com.sportbooking.api.dto.response.payment.PaymentResponse;
import com.sportbooking.api.entity.booking.Booking;
import com.sportbooking.api.entity.payment.Payment;
import com.sportbooking.api.entity.payment.PaymentProof;
import com.sportbooking.api.repository.booking.BookingRepository;
import com.sportbooking.api.repository.payment.PaymentProofRepository;
import com.sportbooking.api.repository.payment.PaymentRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentProofRepository paymentProofRepository;
    private final BookingRepository bookingRepository;
    private final Cloudinary cloudinary;

    @Value("${app.bank.bin:970422}")
    private String bankBin;
    @Value("${app.bank.account-no:0000000000}")
    private String accountNo;
    @Value("${app.bank.account-name:SAN BONG SVD}")
    private String accountName;
    @Value("${app.bank.bank-name:MB Bank}")
    private String bankName;

    private static final String PROOF_FOLDER = "sport-booking/payment-proof";

    /** Tạo bản ghi thanh toán PENDING cho booking (BANK_QR / PAYOS). */
    @Transactional
    public Payment createForBooking(Booking booking, PaymentMethod method) {
        Payment payment = Payment.builder()
                .booking(booking)
                .amount(booking.getTotalPrice())
                .method(method)
                .status(PaymentStatus.PENDING)
                .transactionCode(booking.getBookingCode())
                .expiredAt(LocalDateTime.now().plusMinutes(15))
                .build();
        return paymentRepository.save(payment);
    }

    /** Tạo bản ghi thanh toán đã PAID cho booking trả bằng COIN (để có thể hoàn tiền sau này). */
    @Transactional
    public Payment createCoinPaid(Booking booking) {
        Payment payment = Payment.builder()
                .booking(booking)
                .amount(booking.getTotalPrice())
                .method(PaymentMethod.COIN)
                .status(PaymentStatus.PAID)
                .transactionCode(booking.getBookingCode())
                .paidAt(LocalDateTime.now())
                .build();
        return paymentRepository.save(payment);
    }

    /** Lấy thông tin thanh toán theo booking (để hiển thị QR). */
    public PaymentResponse getByBookingId(String bookingId) {
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));
        return toResponse(payment);
    }

    /** Người dùng upload ảnh bill chuyển khoản. */
    @Transactional
    public PaymentResponse uploadProof(String paymentId, MultipartFile file) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));

        if (file == null || file.isEmpty()) {
            throw new AppException(ErrorCode.INVALID_FILE_TYPE);
        }

        String imageUrl;
        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", PROOF_FOLDER,
                            "public_id", payment.getId(),
                            "overwrite", true,
                            "resource_type", "image"));
            imageUrl = uploadResult.get("secure_url").toString();
        } catch (Exception e) {
            log.error("Upload bill thất bại", e);
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }

        PaymentProof proof = PaymentProof.builder()
                .payment(payment)
                .imageUrl(imageUrl)
                .build();
        paymentProofRepository.save(proof);

        // Đã có bill -> chờ admin xác nhận
        Booking booking = payment.getBooking();
        booking.setStatus(BookingStatus.PENDING_CONFIRMATION);
        bookingRepository.save(booking);

        return toResponse(payment);
    }

    /** Giả lập PayOS thanh toán thành công (dùng khi chưa cấu hình tài khoản PayOS thật). */
    @Transactional
    public PaymentResponse mockSuccess(String paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));
        payment.setStatus(PaymentStatus.PAID);
        payment.setPaidAt(LocalDateTime.now());
        paymentRepository.save(payment);

        Booking booking = payment.getBooking();
        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        return toResponse(payment);
    }

    /** Danh sách thanh toán cho admin duyệt (loại trừ thanh toán bằng coin). */
    public List<AdminPaymentResponse> listForAdmin() {
        return paymentRepository.findAllByOrderByCreatedAtDesc().stream()
                .filter(p -> p.getMethod() != PaymentMethod.COIN)
                .map(this::toAdminResponse)
                .toList();
    }

    /** Admin duyệt: xác nhận đã nhận tiền -> booking CONFIRMED. */
    @Transactional
    public AdminPaymentResponse approve(String paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));
        payment.setStatus(PaymentStatus.PAID);
        payment.setPaidAt(LocalDateTime.now());
        paymentRepository.save(payment);

        Booking booking = payment.getBooking();
        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        return toAdminResponse(payment);
    }

    /** Admin từ chối: booking REJECTED. */
    @Transactional
    public AdminPaymentResponse reject(String paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));
        payment.setStatus(PaymentStatus.FAILED);
        paymentRepository.save(payment);

        Booking booking = payment.getBooking();
        booking.setStatus(BookingStatus.REJECTED);
        bookingRepository.save(booking);

        return toAdminResponse(payment);
    }

    /* ===================== Helpers ===================== */

    private String buildQrUrl(Payment payment) {
        long amount = payment.getAmount() != null
                ? payment.getAmount().setScale(0, java.math.RoundingMode.HALF_UP).longValueExact()
                : 0L;
        String content = payment.getTransactionCode() != null ? payment.getTransactionCode() : "";
        String encodedName = URLEncoder.encode(accountName, StandardCharsets.UTF_8);
        String encodedContent = URLEncoder.encode(content, StandardCharsets.UTF_8);
        return String.format(
                "https://img.vietqr.io/image/%s-%s-compact2.png?amount=%d&addInfo=%s&accountName=%s",
                bankBin, accountNo, amount, encodedContent, encodedName);
    }

    private PaymentResponse toResponse(Payment payment) {
        String proofUrl = paymentProofRepository
                .findTopByPaymentIdOrderByUploadedAtDesc(payment.getId())
                .map(PaymentProof::getImageUrl)
                .orElse(null);

        return PaymentResponse.builder()
                .paymentId(payment.getId())
                .bookingId(payment.getBooking().getId())
                .bookingCode(payment.getBooking().getBookingCode())
                .amount(payment.getAmount())
                .method(payment.getMethod().name())
                .status(payment.getStatus().name())
                .expiredAt(payment.getExpiredAt())
                .qrUrl(buildQrUrl(payment))
                .bankName(bankName)
                .accountNo(accountNo)
                .accountName(accountName)
                .transferContent(payment.getTransactionCode())
                .proofImageUrl(proofUrl)
                .build();
    }

    private AdminPaymentResponse toAdminResponse(Payment payment) {
        Booking booking = payment.getBooking();
        String proofUrl = paymentProofRepository
                .findTopByPaymentIdOrderByUploadedAtDesc(payment.getId())
                .map(PaymentProof::getImageUrl)
                .orElse(null);

        return AdminPaymentResponse.builder()
                .paymentId(payment.getId())
                .bookingId(booking.getId())
                .bookingCode(booking.getBookingCode())
                .customerName(booking.getCustomerName())
                .customerPhone(booking.getCustomerPhone())
                .fieldName(booking.getField().getName())
                .venueName(booking.getField().getVenue().getName())
                .bookingDate(booking.getBookingDate())
                .amount(payment.getAmount())
                .method(payment.getMethod().name())
                .status(payment.getStatus().name())
                .bookingStatus(booking.getStatus().name())
                .createdAt(payment.getCreatedAt())
                .proofImageUrl(proofUrl)
                .build();
    }
}
