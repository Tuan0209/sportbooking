package com.sportbooking.api.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.MethodArgumentNotValidException;

@ControllerAdvice // @ControllerAdvice la 1 annotation cua Spring de xu ly cac exception toan cuc
                  // trong ung dung
public class GlobalExceptionHandler {
    @ExceptionHandler(value = RuntimeException.class) // @ExceptionHandler de chi dinh loai exception ma ham nay se xu
                                                      // ly
    ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage()); // tra ve loi 400 va thong bao loi
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class) // xu ly tat ca cac exception khac
    ResponseEntity<String> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        return ResponseEntity.badRequest()
                .body(ex.getBindingResult().getFieldError().getDefaultMessage());
        // getBindingResult() de lay ket qua binding, getFieldError() de lay loi dau
        // tien, getDefaultMessage() de lay thong bao loi
    }
}
