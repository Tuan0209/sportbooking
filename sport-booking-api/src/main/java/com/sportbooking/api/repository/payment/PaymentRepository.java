package com.sportbooking.api.repository.payment;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.sportbooking.api.common.enums.PaymentStatus;
import com.sportbooking.api.entity.payment.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {

    Optional<Payment> findByBookingId(String bookingId);

    Optional<Payment> findByTransactionCode(String transactionCode);

    List<Payment> findAllByOrderByCreatedAtDesc();

    List<Payment> findByStatusOrderByCreatedAtDesc(PaymentStatus status);

    long countByStatus(PaymentStatus status);

    @Query("select coalesce(sum(p.amount),0) from Payment p where p.status = com.sportbooking.api.common.enums.PaymentStatus.PAID")
    BigDecimal totalPaidRevenue();
}
