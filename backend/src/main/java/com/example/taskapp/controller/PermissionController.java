package com.example.taskapp.controller;

import com.example.taskapp.model.Permission;
import com.example.taskapp.service.PermissionService;
import com.example.taskapp.core.util.ResponseUtils;
import com.example.taskapp.config.Api;
import com.example.taskapp.config.ApiDocs;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/permissions")
@CrossOrigin(origins = "http://localhost:4500")
public class PermissionController {
    private final PermissionService permissionService;

    public PermissionController(PermissionService permissionService) {
        this.permissionService = permissionService;
    }

    @GetMapping
    @Operation(operationId = "Permissions", summary = "Get All Permissions", description = "Retrieve a list of all available system permissions.")
    @ApiResponse(
            responseCode = "200",
            description = "ok",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = ApiDocs.PermissionsDoc.class),
                    examples = @ExampleObject(name = Api.CodeMessage.ok)
            )
    )
    public ResponseEntity<?> getAllPermissions() {
        return ResponseUtils.ok(permissionService.getAllPermissions());
    }
}
