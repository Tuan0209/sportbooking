package com.sportbooking.api.exception;

public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized exception"),
    USER_EXISTS(1002, "User already exists"),
    USER_INVALID(1003, "Username must be between 3 and 50 characters"),
    USER_NOT_FOUND(1004, "User not found");

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
