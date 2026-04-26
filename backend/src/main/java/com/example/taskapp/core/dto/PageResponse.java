package com.example.taskapp.core.dto;

import java.util.List;

public class PageResponse<T> {
    private List<T> data;
    private Pagination pagination;

    public PageResponse(List<T> data, long totalElements, int size, int number) {
        this.data = data;
        this.pagination = new Pagination(totalElements, size, number);
    }

    public List<T> getData() { return data; }
    public void setData(List<T> data) { this.data = data; }

    public Pagination getPagination() { return pagination; }
    public void setPagination(Pagination pagination) { this.pagination = pagination; }

    public static class Pagination {
        private long totalElements;
        private int totalPages;
        private int size;
        private int number;

        public Pagination(long totalElements, int size, int number) {
            this.totalElements = totalElements;
            this.size = size;
            this.number = number;
            this.totalPages = (int) Math.ceil((double) totalElements / size);
        }

        public long getTotalElements() { return totalElements; }
        public void setTotalElements(long totalElements) { this.totalElements = totalElements; }

        public int getTotalPages() { return totalPages; }
        public void setTotalPages(int totalPages) { this.totalPages = totalPages; }

        public int getSize() { return size; }
        public void setSize(int size) { this.size = size; }

        public int getNumber() { return number; }
        public void setNumber(int number) { this.number = number; }
    }
}
