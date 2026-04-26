package com.example.taskapp.core.util;

import com.example.taskapp.core.dto.ApiResponse;
import com.example.taskapp.core.dto.PageResponse;
import com.example.taskapp.config.Api;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

public class ResponseUtils {

    private ResponseUtils() {
        // Hide implicit public constructor
    }

    public static <T> ResponseEntity<ApiResponse<T>> ok(T data) {
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    public static <T> ResponseEntity<ApiResponse<List<T>>> ok(PageResponse<T> pageResponse) {
        return ResponseEntity.ok(ApiResponse.success(pageResponse.getData(), pageResponse.getPagination()));
    }

    public static <T> ResponseEntity<ApiResponse<T>> ok(T data, String message) {
        return ResponseEntity.ok(new ApiResponse<>("200", message, data));
    }

    public static <T> ResponseEntity<ApiResponse<T>> created(T data) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(data));
    }

    public static ResponseEntity<ApiResponse<Void>> success(String message) {
        return ResponseEntity.ok(new ApiResponse<>("200", message, null));
    }

    public static <T> ResponseEntity<ApiResponse<T>> error(HttpStatus status, String code, String message) {
        return ResponseEntity.status(status).body(ApiResponse.error(code, message));
    }

    public static <T> ResponseEntity<ApiResponse<T>> badRequest(String message) {
        return error(HttpStatus.BAD_REQUEST, "400", message != null ? message : Api.CodeMessage.badRequest);
    }

    public static <T> ResponseEntity<ApiResponse<T>> unauthorized(String message) {
        return error(HttpStatus.UNAUTHORIZED, "401", message != null ? message : Api.CodeMessage.unauthorized);
    }

    public static <T> ResponseEntity<ApiResponse<T>> forbidden(String message) {
        return error(HttpStatus.FORBIDDEN, "403", message != null ? message : Api.CodeMessage.forbidden);
    }

    public static <T> ResponseEntity<ApiResponse<T>> notFound(String message) {
        return error(HttpStatus.NOT_FOUND, "404", message != null ? message : Api.CodeMessage.notFound);
    }

    public static <T> ResponseEntity<ApiResponse<T>> internalError(String message) {
        return error(HttpStatus.INTERNAL_SERVER_ERROR, "500", message != null ? message : Api.CodeMessage.error);
    }
}
