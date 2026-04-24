package com.example.taskapp.service;

import com.example.taskapp.mapper.PermissionMapper;
import com.example.taskapp.model.Permission;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PermissionService {
    private final PermissionMapper permissionMapper;

    public PermissionService(PermissionMapper permissionMapper) {
        this.permissionMapper = permissionMapper;
    }

    public List<Permission> getAllPermissions() {
        return permissionMapper.findAll();
    }
}
