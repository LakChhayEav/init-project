package com.example.taskapp.core.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public class FilterPaging<F extends Filter> {

    @Valid
    @NotNull
    private F filter;

    private Pagination pagination = new Pagination();

    public F getFilter() {
        return filter;
    }

    public void setFilter(F filter) {
        this.filter = filter;
    }

    public Pagination getPagination() {
        return pagination;
    }

    public void setPagination(Pagination pagination) {
        this.pagination = pagination;
    }

    @Override
    public String toString() {
        return "FilterPaging{" +
                "filter=" + filter +
                ", pagination=" + pagination +
                '}';
    }
}
