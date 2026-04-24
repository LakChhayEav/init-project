package com.example.taskapp.controller;

import com.example.taskapp.model.Role;
import com.example.taskapp.service.RoleService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin(origins = "http://localhost:4500")
public class RoleController {
    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping
    public List<Role> getAllRoles() {
        return roleService.getAllRoles();
    }

    @GetMapping("/{id}")
    public Role getRoleById(@PathVariable Integer id) {
        return roleService.getRoleById(id);
    }

    @PostMapping
    public void createRole(@RequestBody Role role) {
        roleService.createRole(role);
    }

    @PutMapping("/{id}")
    public void updateRole(@PathVariable Integer id, @RequestBody Role role) {
        role.setId(id);
        roleService.updateRole(role);
    }

    @DeleteMapping("/{id}")
    public void deleteRole(@PathVariable Integer id) {
        roleService.deleteRole(id);
    }

    @PostMapping("/{roleId}/permissions/{permissionId}")
    public void assignPermission(@PathVariable Integer roleId, @PathVariable Integer permissionId) {
        roleService.assignPermission(roleId, permissionId);
    }

    @DeleteMapping("/{roleId}/permissions/{permissionId}")
    public void revokePermission(@PathVariable Integer roleId, @PathVariable Integer permissionId) {
        roleService.revokePermission(roleId, permissionId);
    }

    @PutMapping("/{id}/permissions")
    public void updateRolePermissions(@PathVariable Integer id, @RequestBody List<Integer> permissionIds) {
        roleService.updateRolePermissions(id, permissionIds);
    }
}
