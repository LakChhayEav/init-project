package com.example.taskapp.core.interceptor;

public class PageContext {
    private static final ThreadLocal<Long> TOTAL = new ThreadLocal<>();

    public static void setTotal(long total) {
        TOTAL.set(total);
    }

    public static Long getTotal() {
        return TOTAL.get();
    }

    public static void clear() {
        TOTAL.remove();
    }
}
