package com.sportbooking.api.repository.refund;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sportbooking.api.entity.refund.RefundRequest;

@Repository
public interface RefundRequestRepository extends JpaRepository<RefundRequest, String> {

    List<RefundRequest> findAllByOrderByCreatedAtDesc();

    boolean existsByBookingIdAndStatusIn(String bookingId, List<com.sportbooking.api.common.enums.RefundStatus> statuses);
}
