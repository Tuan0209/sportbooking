package com.sportbooking.api.common.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.sportbooking.api.common.ApiResponse;
import com.sportbooking.api.common.enums.ErrorCode;

import org.springframework.web.bind.MethodArgumentNotValidException;

@ControllerAdvice // @ControllerAdvice la 1 annotation cua Spring de xu ly cac exception toan cuc
                  // trong ung dung
public class GlobalExceptionHandler {
    @ExceptionHandler(value = RuntimeException.class) // @ExceptionHandler de chi dinh loai exception ma ham nay se xu
                                                      // ly
    ResponseEntity<ApiResponse> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.badRequest().body(ApiResponse.builder()
                .code(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode())
                .message(ErrorCode.UNCATEGORIZED_EXCEPTION.getMessage())
                .build()); // tra ve loi 400 va thong bao loi
    }

    @ExceptionHandler(value = AppException.class) // xu ly cac exception do AppException sinh ra
    ResponseEntity<ApiResponse> handleAppException(AppException ex) {
        ErrorCode errorCode = ex.getErrorCode(); // lay ra ErrorCode tu AppException
        return ResponseEntity.badRequest().body(ApiResponse.builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build()); // tra ve
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class) // xu ly tat ca cac exception khac
    ResponseEntity<ApiResponse> handlingValidationExceptions(MethodArgumentNotValidException ex) {
        String enumKey = ex.getFieldError().getDefaultMessage(); // lay ra key tu message trong annotation @Size o
                                                                 // UserCreateRequest
        ErrorCode errorCode = ErrorCode.valueOf(enumKey); // chuyen key do thanh enum ErrorCode
        try {
            errorCode = ErrorCode.valueOf(enumKey);
        } catch (IllegalArgumentException e) {
            errorCode = ErrorCode.UNCATEGORIZED_EXCEPTION; // neu key do khong ton tai trong enum thi tra ve loi chung
        }
        return ResponseEntity.badRequest().body(ApiResponse.builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build()); // tra ve loi 400 va thong bao loi tu enum ErrorCode
    }
}
