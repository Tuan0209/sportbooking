package com.sportbooking.api.repository.voucher;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sportbooking.api.entity.voucher.Voucher;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, String> {

    Optional<Voucher> findByCodeIgnoreCase(String code);

    List<Voucher> findAllByOrderByCreatedAtDesc();
}
