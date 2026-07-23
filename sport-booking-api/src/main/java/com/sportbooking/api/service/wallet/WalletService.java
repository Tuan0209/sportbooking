package com.sportbooking.api.service.wallet;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sportbooking.api.common.enums.ErrorCode;
import com.sportbooking.api.common.enums.WalletTransactionType;
import com.sportbooking.api.common.exception.AppException;
import com.sportbooking.api.dto.response.wallet.WalletResponse;
import com.sportbooking.api.entity.user.User;
import com.sportbooking.api.entity.wallet.WalletTransaction;
import com.sportbooking.api.repository.user.UserRepository;
import com.sportbooking.api.repository.wallet.WalletTransactionRepository;
import org.springframework.beans.factory.annotation.Value;
import lombok.RequiredArgsConstructor;
import vn.payos.PayOS;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkRequest;

@Service
@RequiredArgsConstructor
public class WalletService {

        private final WalletTransactionRepository walletTransactionRepository;
        private final UserRepository userRepository;
        @Value("${payos.client-id}")
        private String clientId;

        @Value("${payos.api-key}")
        private String apiKey;

        @Value("${payos.checksum-key}")
        private String checksumKey;

        public WalletResponse getWallet(String userId) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

                var txs = walletTransactionRepository.findByUserIdOrderByCreatedAtDesc(userId)
                                .stream()
                                .map(t -> WalletResponse.Tx.builder()
                                                .amount(t.getAmount())
                                                .type(t.getType().name())
                                                .reason(t.getReason())
                                                .balanceAfter(t.getBalanceAfter())
                                                .createdAt(t.getCreatedAt())
                                                .build())
                                .toList();

                return WalletResponse.builder()
                                .balance(user.getCoinBalance())
                                .transactions(txs)
                                .build();
        }

        /** Nạp coin (demo). */
        @Transactional
        public WalletResponse topUp(String userId, BigDecimal amount) {
                if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
                        throw new AppException(ErrorCode.INVALID_REQUEST);
                }
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

                BigDecimal newBalance = user.getCoinBalance().add(amount);
                user.setCoinBalance(newBalance);
                userRepository.save(user);

                walletTransactionRepository.save(WalletTransaction.builder()
                                .userId(userId)
                                .amount(amount)
                                .type(WalletTransactionType.ADD)
                                .reason("Nạp coin qua cổng PayOS")
                                .balanceAfter(newBalance)
                                .build());

                return getWallet(userId);
        }

        @Transactional
        public String createTopupPayment(String userId, BigDecimal amount) {

                if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
                        throw new AppException(ErrorCode.INVALID_REQUEST);
                }

                userRepository.findById(userId)
                                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

                try {

                        PayOS payOS = new PayOS(
                                        clientId,
                                        apiKey,
                                        checksumKey);

                        long orderCode = Math.abs(System.currentTimeMillis());

                        CreatePaymentLinkRequest request = CreatePaymentLinkRequest.builder()
                                        .orderCode(orderCode)
                                        .amount(amount.longValue())
                                        .description("NAPCOIN")
                                        .cancelUrl("http://localhost:5173/wallet")
                                        .returnUrl("http://localhost:5173/wallet?success=true&amount=" + amount)
                                        .build();

                        var result = payOS.paymentRequests().create(request);

                        return result.getCheckoutUrl();

                } catch (Exception e) {
                        e.printStackTrace();
                        throw new RuntimeException("Không tạo được PayOS");
                }
        }

        @Transactional
        public WalletResponse topupSuccess(
                        String userId,
                        BigDecimal amount) {

                return topUp(userId, amount);

        }
}
