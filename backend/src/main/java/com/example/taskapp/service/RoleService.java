package com.example.taskapp.service;

import com.example.taskapp.model.Role;
import java.util.List;

public interface RoleService {
    List<Role> getAllRoles();
    Role getRoleById(Integer id);
    void createRole(Role role);
    void updateRole(Role role);
    void deleteRole(Integer id);
    void assignPermission(Integer roleId, Integer permissionId);
    void revokePermission(Integer roleId, Integer permissionId);
    void revokeAllPermissions(Integer roleId);
    void updateRolePermissions(Integer roleId, List<Integer> permissionIds);
}
