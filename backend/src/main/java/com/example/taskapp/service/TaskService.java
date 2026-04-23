package com.example.taskapp.service;

import com.example.taskapp.mapper.TaskMapper;
import com.example.taskapp.model.Task;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TaskService {
    private final TaskMapper taskMapper;

    public TaskService(TaskMapper taskMapper) {
        this.taskMapper = taskMapper;
    }

    public List<Task> getAllTasks() {
        return taskMapper.findAll();
    }

    public Task getTaskById(Long id) {
        return taskMapper.findById(id);
    }

    public void createTask(Task task) {
        taskMapper.insert(task);
    }

    public void updateTask(Task task) {
        taskMapper.update(task);
    }

    public void deleteTask(Long id) {
        taskMapper.delete(id);
    }
}
