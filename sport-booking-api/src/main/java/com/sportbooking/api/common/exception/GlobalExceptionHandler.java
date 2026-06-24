package com.sportbooking.api.common.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.sportbooking.api.common.ApiResponse;
import com.sportbooking.api.common.enums.ErrorCode;

import org.springframework.web.bind.MethodArgumentNotValidException;
import lombok.extern.slf4j.Slf4j;

@ControllerAdvice // @ControllerAdvice la 1 annotation cua Spring de xu ly cac exception toan cuc
                  // trong ung dung
@Slf4j
public class GlobalExceptionHandler {
    @ExceptionHandler(value = RuntimeException.class) // @ExceptionHandler de chi dinh loai exception ma ham nay se xu
                                                      // ly
    ResponseEntity<ApiResponse> handleRuntimeException(RuntimeException ex) {
        log.error("Uncategorized exception", ex); // log stack de de debug
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

    @ExceptionHandler(value = MethodArgumentNotValidException.class) // xu ly loi validate
    ResponseEntity<ApiResponse> handlingValidationExceptions(MethodArgumentNotValidException ex) {
        String message = ex.getFieldError() != null
                ? ex.getFieldError().getDefaultMessage()
                : "Dữ liệu không hợp lệ";

        // Nếu message là key của ErrorCode thì dùng code tương ứng, ngược lại trả message gốc
        try {
            ErrorCode errorCode = ErrorCode.valueOf(message);
            return ResponseEntity.badRequest().body(ApiResponse.builder()
                    .code(errorCode.getCode())
                    .message(errorCode.getMessage())
                    .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.builder()
                    .code(ErrorCode.INVALID_REQUEST.getCode())
                    .message(message)
                    .build());
        }
    }
}
