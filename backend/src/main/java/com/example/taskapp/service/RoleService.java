package com.example.taskapp.service;

import com.example.taskapp.mapper.RoleMapper;
import com.example.taskapp.model.Role;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
        roleMapper.insert(role);
    }

    @Transactional
    public void updateRole(Role role) {
        roleMapper.update(role);
    }

    @Transactional
    public void deleteRole(Integer id) {
        roleMapper.delete(id);
    }

    @Transactional
    public void assignPermission(Integer roleId, Integer permissionId) {
        roleMapper.addPermissionToRole(roleId, permissionId);
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
            for (Integer pid : permissionIds) {
                roleMapper.addPermissionToRole(roleId, pid);
            }
        }
    }
}
