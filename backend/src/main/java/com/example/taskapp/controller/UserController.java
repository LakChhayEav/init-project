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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/search")
    @PreAuthorize("hasAuthority('USERS_VIEW')")
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
    @PreAuthorize("hasAuthority('USERS_VIEW')")
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
    @PreAuthorize("hasAuthority('USERS_CREATE')")
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
        return ResponseUtils.success(Api.CodeMessage.created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('USERS_UPDATE')")
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
        return ResponseUtils.success(Api.CodeMessage.updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('USERS_DELETE')")
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
        return ResponseUtils.success(Api.CodeMessage.deleted);
    }

    @PostMapping("/{userId}/roles/{roleId}")
    @PreAuthorize("hasAuthority('USERS_UPDATE')")
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
        return ResponseUtils.success(Api.CodeMessage.success);
    }

    @DeleteMapping("/{userId}/roles/{roleId}")
    @PreAuthorize("hasAuthority('USERS_UPDATE')")
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
        return ResponseUtils.success(Api.CodeMessage.success);
    }
}
