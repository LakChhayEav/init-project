package com.example.taskapp.service.impl;

import com.example.taskapp.mapper.TaskMapper;
import com.example.taskapp.model.Task;
import com.example.taskapp.service.TaskService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TaskServiceImpl implements TaskService {
    private final TaskMapper taskMapper;

    public TaskServiceImpl(TaskMapper taskMapper) {
        this.taskMapper = taskMapper;
    }

    @Override
    public List<Task> getAllTasks() {
        return taskMapper.findAll();
    }

    @Override
    public Task getTaskById(Long id) {
        return taskMapper.findById(id);
    }

    @Override
    public void createTask(Task task) {
        taskMapper.insert(task);
    }

    @Override
    public void updateTask(Task task) {
        taskMapper.update(task);
    }

    @Override
    public void deleteTask(Long id) {
        taskMapper.delete(id);
    }
}
