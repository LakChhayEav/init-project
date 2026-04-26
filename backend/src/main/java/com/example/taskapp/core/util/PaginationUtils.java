package com.example.taskapp.core.util;

import com.example.taskapp.core.interceptor.PageContext;
import com.example.taskapp.core.dto.PageResponse;
import com.example.taskapp.core.dto.Pagination;

import java.util.List;

public class PaginationUtils {

    private PaginationUtils() {
        // Hide implicit public constructor
    }

    public static <T> PageResponse<T> execute(Pagination pagination, PageQuery<T> query) {
        var page = pagination.getPage();
        var size = pagination.getSize();
        var offset = page * size;
        var sortBy = pagination.getSortBy();
        var sortDirection = pagination.getSortDirection();

        PageContext.clear(); // Ensure we don't read stale data
        List<T> data = query.execute(size, offset, sortBy, sortDirection);
        long total = PageContext.getTotal();

        return new PageResponse<>(data, total, size, page);
    }
}
