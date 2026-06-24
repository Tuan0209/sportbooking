package com.sportbooking.api.dto.request.refund;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

/** Admin duyệt hoàn tiền: với BANK_TRANSFER cần mã giao dịch + ảnh đã chuyển. */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApproveRefundRequest {
    String transactionCode; // mã giao dịch chuyển khoản (BANK_TRANSFER)
    String proofImage;      // link ảnh đã chuyển (tuỳ chọn)
}
