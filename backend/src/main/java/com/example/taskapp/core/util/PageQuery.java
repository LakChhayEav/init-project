package com.example.taskapp.core.util;

import java.util.List;

@FunctionalInterface
public interface PageQuery<T> {
    List<T> execute(int size, int offset, String sortBy, String sortDirection);
}
