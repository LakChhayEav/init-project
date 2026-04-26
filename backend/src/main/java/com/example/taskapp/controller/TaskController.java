package com.example.taskapp.controller;

import com.example.taskapp.model.Task;
import com.example.taskapp.service.TaskService;
import com.example.taskapp.core.util.ResponseUtils;
import com.example.taskapp.config.Api;
import com.example.taskapp.config.ApiDocs;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('TASKS_VIEW')")
    @Operation(operationId = "Tasks", summary = "Get All Tasks", description = "Retrieve a list of all tasks in the system.")
    @ApiResponse(
            responseCode = "200",
            description = "ok",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = ApiDocs.TasksDoc.class),
                    examples = @ExampleObject(name = Api.CodeMessage.ok)
            )
    )
    public ResponseEntity<?> getAllTasks() {
        return ResponseUtils.ok(taskService.getAllTasks());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('TASKS_VIEW')")
    @Operation(operationId = "Tasks", summary = "Get Task by ID", description = "Retrieve a specific task by its unique ID.")
    @ApiResponse(
            responseCode = "200",
            description = "ok",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = ApiDocs.TasksDoc.class),
                    examples = @ExampleObject(name = Api.CodeMessage.ok)
            )
    )
    public ResponseEntity<?> getTaskById(@PathVariable Long id) {
        return ResponseUtils.ok(taskService.getTaskById(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('TASKS_CREATE')")
    @Operation(operationId = "Tasks", summary = "Create Task", description = "Add a new task to the collection.")
    @ApiResponse(
            responseCode = "200",
            description = "ok",
            content = @Content(
                    mediaType = "application/json",
                    examples = @ExampleObject(name = Api.CodeMessage.ok)
            )
    )
    public ResponseEntity<?> createTask(@RequestBody Task task) {
        taskService.createTask(task);
        return ResponseUtils.success(Api.CodeMessage.created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('TASKS_UPDATE')")
    @Operation(operationId = "Tasks", summary = "Update Task", description = "Modify the properties of an existing task.")
    @ApiResponse(
            responseCode = "200",
            description = "ok",
            content = @Content(
                    mediaType = "application/json",
                    examples = @ExampleObject(name = Api.CodeMessage.ok)
            )
    )
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody Task task) {
        task.setId(id);
        taskService.updateTask(task);
        return ResponseUtils.success(Api.CodeMessage.updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('TASKS_DELETE')")
    @Operation(operationId = "Tasks", summary = "Delete Task", description = "Remove a task from the system.")
    @ApiResponse(
            responseCode = "200",
            description = "ok",
            content = @Content(
                    mediaType = "application/json",
                    examples = @ExampleObject(name = Api.CodeMessage.ok)
            )
    )
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseUtils.success(Api.CodeMessage.deleted);
    }
}
