package com.example.taskapp.service;

import com.example.taskapp.model.Task;
import java.util.List;

public interface TaskService {
    List<Task> getAllTasks();
    Task getTaskById(Long id);
    void createTask(Task task);
    void updateTask(Task task);
    void deleteTask(Long id);
}
