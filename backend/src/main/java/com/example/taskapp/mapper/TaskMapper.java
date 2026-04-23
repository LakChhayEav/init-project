package com.example.taskapp.mapper;

import com.example.taskapp.model.Task;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface TaskMapper {
    List<Task> findAll();
    Task findById(Long id);
    void insert(Task task);
    void update(Task task);
    void delete(Long id);
}
