package com.example.taskapp.controller;

import com.example.taskapp.service.UserService;
import com.example.taskapp.core.dto.FilterPaging;
import com.example.taskapp.core.dto.PageRequest;
import com.example.taskapp.config.Api;
import com.example.taskapp.config.ApiDocs;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import com.example.taskapp.core.util.ResponseUtils;
import com.example.taskapp.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4500")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/search")
    @Operation(operationId = "Users", summary = "Search Users", description = "Retrieve a paginated list of users with filtering and sorting options.")
    @ApiResponse(
            responseCode = "200",
            description = "ok",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = ApiDocs.UsersDoc.class),
                    examples = @ExampleObject(name = Api.CodeMessage.ok)
            )
    )
    public ResponseEntity<?> getAllUsers(@RequestBody FilterPaging<PageRequest> request) {
        return ResponseUtils.ok(userService.getPagedUsers(request, request.getPagination()));
    }

    @PostMapping("/{id}")
    @Operation(operationId = "Users", summary = "Get User by ID", description = "Retrieve detailed information for a specific user by their unique ID.")
    @ApiResponse(
            responseCode = "200",
            description = "ok",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = ApiDocs.UsersDoc.class),
                    examples = @ExampleObject(name = Api.CodeMessage.ok)
            )
    )
    public ResponseEntity<?> getUserById(@PathVariable Integer id) {
        return ResponseUtils.ok(userService.getUserById(id));
    }

    @PostMapping
    @Operation(operationId = "Users", summary = "Create User", description = "Register a new user in the system.")
    @ApiResponse(
            responseCode = "200",
            description = "ok",
            content = @Content(
                    mediaType = "application/json",
                    examples = @ExampleObject(name = Api.CodeMessage.ok)
            )
    )
    public ResponseEntity<?> createUser(@RequestBody User user) {
        userService.createUser(user);
        return ResponseUtils.success("User created successfully");
    }

    @PutMapping("/{id}")
    @Operation(operationId = "Users", summary = "Update User", description = "Modify the details of an existing user.")
    @ApiResponse(
            responseCode = "200",
            description = "ok",
            content = @Content(
                    mediaType = "application/json",
                    examples = @ExampleObject(name = Api.CodeMessage.ok)
            )
    )
    public ResponseEntity<?> updateUser(@PathVariable Integer id, @RequestBody User user) {
        user.setId(id);
        userService.updateUser(user);
        return ResponseUtils.success("User updated successfully");
    }

    @DeleteMapping("/{id}")
    @Operation(operationId = "Users", summary = "Delete User", description = "Permanently remove a user from the system.")
    @ApiResponse(
            responseCode = "200",
            description = "ok",
            content = @Content(
                    mediaType = "application/json",
                    examples = @ExampleObject(name = Api.CodeMessage.ok)
            )
    )
    public ResponseEntity<?> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseUtils.success("User deleted successfully");
    }

    @PostMapping("/{userId}/roles/{roleId}")
    @Operation(operationId = "Users", summary = "Add Role to User", description = "Assign a specific security role to a user.")
    @ApiResponse(
            responseCode = "200",
            description = "ok",
            content = @Content(
                    mediaType = "application/json",
                    examples = @ExampleObject(name = Api.CodeMessage.ok)
            )
    )
    public ResponseEntity<?> addRoleToUser(@PathVariable Integer userId, @PathVariable Integer roleId) {
        userService.addRoleToUser(userId, roleId);
        return ResponseUtils.success("Role added to user");
    }

    @DeleteMapping("/{userId}/roles/{roleId}")
    @Operation(operationId = "Users", summary = "Remove Role from User", description = "Revoke a specific security role from a user.")
    @ApiResponse(
            responseCode = "200",
            description = "ok",
            content = @Content(
                    mediaType = "application/json",
                    examples = @ExampleObject(name = Api.CodeMessage.ok)
            )
    )
    public ResponseEntity<?> removeRoleFromUser(@PathVariable Integer userId, @PathVariable Integer roleId) {
        userService.removeRoleFromUser(userId, roleId);
        return ResponseUtils.success("Role removed from user");
    }
}
