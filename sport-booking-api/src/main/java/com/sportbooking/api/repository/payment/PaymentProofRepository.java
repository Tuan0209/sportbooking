package com.sportbooking.api.repository.payment;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sportbooking.api.entity.payment.PaymentProof;

@Repository
public interface PaymentProofRepository extends JpaRepository<PaymentProof, String> {

    Optional<PaymentProof> findTopByPaymentIdOrderByUploadedAtDesc(String paymentId);
}
