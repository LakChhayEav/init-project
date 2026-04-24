package com.example.taskapp.service;

import com.example.taskapp.mapper.RoleMapper;
import com.example.taskapp.model.Role;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class RoleService {
    private final RoleMapper roleMapper;

    public RoleService(RoleMapper roleMapper) {
        this.roleMapper = roleMapper;
    }

    public List<Role> getAllRoles() {
        return roleMapper.findAll();
    }

    public Role getRoleById(Integer id) {
        return roleMapper.findById(id);
    }

    @Transactional
    public void createRole(Role role) {
        String currentUser = getCurrentUser();
        LocalDateTime now = LocalDateTime.now();
        role.setCreatedBy(currentUser);
        role.setCreatedDate(now);
        roleMapper.insert(role);
    }

    @Transactional
    public void updateRole(Role role) {
        role.setUpdatedBy(getCurrentUser());
        role.setUpdatedDate(LocalDateTime.now());
        roleMapper.update(role);
    }

    @Transactional
    public void deleteRole(Integer id) {
        roleMapper.delete(id);
    }

    @Transactional
    public void assignPermission(Integer roleId, Integer permissionId) {
        String currentUser = getCurrentUser();
        LocalDateTime now = LocalDateTime.now();
        roleMapper.addPermissionToRole(roleId, permissionId, currentUser, now, null, null);
    }

    @Transactional
    public void revokePermission(Integer roleId, Integer permissionId) {
        roleMapper.removePermissionFromRole(roleId, permissionId);
    }

    @Transactional
    public void revokeAllPermissions(Integer roleId) {
        roleMapper.removeAllPermissionsFromRole(roleId);
    }

    @Transactional
    public void updateRolePermissions(Integer roleId, List<Integer> permissionIds) {
        roleMapper.removeAllPermissionsFromRole(roleId);
        if (permissionIds != null) {
            String currentUser = getCurrentUser();
            LocalDateTime now = LocalDateTime.now();
            for (Integer pid : permissionIds) {
                roleMapper.addPermissionToRole(roleId, pid, currentUser, now, null, null);
            }
        }
    }

    private String getCurrentUser() {
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            return "SYSTEM";
        }
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
