package com.example.taskapp.core.dto;

public class PageRequest implements Filter {
    private String search;

    public PageRequest() {}

    public String getSearch() {
        return search;
    }

    public void setSearch(String search) {
        this.search = search;
    }
}
