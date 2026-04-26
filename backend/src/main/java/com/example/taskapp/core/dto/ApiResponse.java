package com.example.taskapp.core.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private String code;
    private String message;
    private T data;
    private Object pagination;

    public ApiResponse() {}

    public ApiResponse(String code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public ApiResponse(String code, String message, T data, Object pagination) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.pagination = pagination;
    }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public T getData() { return data; }
    public void setData(T data) { this.data = data; }

    public Object getPagination() { return pagination; }
    public void setPagination(Object pagination) { this.pagination = pagination; }

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>("200", "success", data);
    }

    public static <T> ApiResponse<T> success(T data, Object pagination) {
        return new ApiResponse<>("200", "success", data, pagination);
    }

    public static <T> ApiResponse<T> error(String code, String message) {
        return new ApiResponse<>(code, message, null);
    }
}
