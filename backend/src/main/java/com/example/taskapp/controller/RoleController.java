package com.example.taskapp.controller;

import com.example.taskapp.model.Role;
import com.example.taskapp.service.RoleService;
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
@RequestMapping("/api/roles")
public class RoleController {
    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @PostMapping("/search")
    @PreAuthorize("hasAuthority('PERMISSIONS_VIEW')")
    @Operation(operationId = "Roles", summary = "Get All Roles", description = "Retrieve a list of all security roles.")
    @ApiResponse(
            responseCode = "200",
            description = "ok",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = ApiDocs.RolesDoc.class),
                    examples = @ExampleObject(name = Api.CodeMessage.ok)
            )
    )
    public ResponseEntity<?> getAllRoles() {
        return ResponseUtils.ok(roleService.getAllRoles());
    }

    @PostMapping("/{id}")
    @PreAuthorize("hasAuthority('PERMISSIONS_VIEW')")
    @Operation(operationId = "Roles", summary = "Get Role by ID", description = "Retrieve a specific role by its unique ID.")
    @ApiResponse(
            responseCode = "200",
            description = "ok",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = ApiDocs.RolesDoc.class),
                    examples = @ExampleObject(name = Api.CodeMessage.ok)
            )
    )
    public ResponseEntity<?> getRoleById(@PathVariable Integer id) {
        return ResponseUtils.ok(roleService.getRoleById(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('PERMISSIONS_CREATE')")
    @Operation(operationId = "Roles", summary = "Create Role", description = "Create a new security role.")
    @ApiResponse(
            responseCode = "200",
            description = "ok",
            content = @Content(
                    mediaType = "application/json",
                    examples = @ExampleObject(name = Api.CodeMessage.ok)
            )
    )
    public ResponseEntity<?> createRole(@RequestBody Role role) {
        roleService.createRole(role);
        return ResponseUtils.success(Api.CodeMessage.created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('PERMISSIONS_UPDATE')")
    @Operation(operationId = "Roles", summary = "Update Role", description = "Modify an existing security role.")
    @ApiResponse(
            responseCode = "200",
            description = "ok",
            content = @Content(
                    mediaType = "application/json",
                    examples = @ExampleObject(name = Api.CodeMessage.ok)
            )
    )
    public ResponseEntity<?> updateRole(@PathVariable Integer id, @RequestBody Role role) {
        role.setId(id);
        roleService.updateRole(role);
        return ResponseUtils.success(Api.CodeMessage.updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('PERMISSIONS_DELETE')")
    @Operation(operationId = "Roles", summary = "Delete Role", description = "Permanently remove a security role.")
    @ApiResponse(
            responseCode = "200",
            description = "ok",
            content = @Content(
                    mediaType = "application/json",
                    examples = @ExampleObject(name = Api.CodeMessage.ok)
            )
    )
    public ResponseEntity<?> deleteRole(@PathVariable Integer id) {
        roleService.deleteRole(id);
        return ResponseUtils.success(Api.CodeMessage.deleted);
    }

    @PostMapping("/{roleId}/permissions/{permissionId}")
    @PreAuthorize("hasAuthority('PERMISSIONS_UPDATE')")
    @Operation(operationId = "Roles", summary = "Assign Permission", description = "Link a permission to a specific role.")
    @ApiResponse(
            responseCode = "200",
            description = "ok",
            content = @Content(
                    mediaType = "application/json",
                    examples = @ExampleObject(name = Api.CodeMessage.ok)
            )
    )
    public ResponseEntity<?> assignPermission(@PathVariable Integer roleId, @PathVariable Integer permissionId) {
        roleService.assignPermission(roleId, permissionId);
        return ResponseUtils.success(Api.CodeMessage.success);
    }

    @DeleteMapping("/{roleId}/permissions/{permissionId}")
    @PreAuthorize("hasAuthority('ROLES_UPDATE')")
    @Operation(operationId = "Roles", summary = "Revoke Permission", description = "Remove a permission link from a role.")
    @ApiResponse(
            responseCode = "200",
            description = "ok",
            content = @Content(
                    mediaType = "application/json",
                    examples = @ExampleObject(name = Api.CodeMessage.ok)
            )
    )
    public ResponseEntity<?> revokePermission(@PathVariable Integer roleId, @PathVariable Integer permissionId) {
        roleService.revokePermission(roleId, permissionId);
        return ResponseUtils.success(Api.CodeMessage.success);
    }

    @PutMapping("/{id}/permissions")
    @PreAuthorize("hasAuthority('ROLES_UPDATE')")
    @Operation(operationId = "Roles", summary = "Update Role Permissions", description = "Bulk update permissions associated with a role.")
    @ApiResponse(
            responseCode = "200",
            description = "ok",
            content = @Content(
                    mediaType = "application/json",
                    examples = @ExampleObject(name = Api.CodeMessage.ok)
            )
    )
    public ResponseEntity<?> updateRolePermissions(@PathVariable Integer id, @RequestBody List<Integer> permissionIds) {
        roleService.updateRolePermissions(id, permissionIds);
        return ResponseUtils.success(Api.CodeMessage.updated);
    }
}
