package com.sportbooking.api.common.enums;

public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized exception"),
    USER_EXISTS(1002, "User already exists"),
    USER_INVALID(1003, "Username must be between 3 and 50 characters"),
    USER_NOT_FOUND(1004, "User not found"),
    EMAIL_EXISTS(1005, "Email already exists"),
    INVALID_REQUEST(1006, "Invalid request"),
    INVALID_FILE_TYPE(1006, "Tải lên file khong hợp lệ"),
    INVALID_IMAGE_URL(1006, "Link ảnh không hợp lệ"),
    INVALID_PASSWORD(1007, "Mật khẩu cũ không đúng"),
    WRONG_PASSWORD(1008, "Sai mật khẩu"),
    RESET_INFO_MISMATCH(1010, "Email không tồn tại trong hệ thống"),
    INVALID_TOKEN(1011, "Token không hợp lệ hoặc đã hết hạn"),
    FIELD_NOT_FOUND(2001, "Field not found"),
    SLOT_ALREADY_BOOKED(2002, "Khung giờ đã được đặt"),
    BOOKING_NOT_FOUND(2003, "Booking not found"),
    INSUFFICIENT_COINS(2004, "Số dư coin không đủ để thanh toán"),
    PAYMENT_NOT_FOUND(3001, "Không tìm thấy thông tin thanh toán"),
    REFUND_NOT_FOUND(3002, "Không tìm thấy yêu cầu hoàn tiền"),
    REFUND_INVALID(3003, "Yêu cầu hoàn tiền không hợp lệ"),
    VOUCHER_INVALID(4001, "Mã giảm giá không hợp lệ hoặc đã hết hạn"),
    VOUCHER_MIN_ORDER(4002, "Đơn hàng chưa đạt giá trị tối thiểu để dùng mã"),
    PLAN_NOT_FOUND(4003, "Không tìm thấy gói thành viên");

    private int code;
    private String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
