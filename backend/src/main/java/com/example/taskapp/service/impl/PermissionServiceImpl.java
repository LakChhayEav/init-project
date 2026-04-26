package com.example.taskapp.service.impl;

import com.example.taskapp.mapper.PermissionMapper;
import com.example.taskapp.model.Permission;
import com.example.taskapp.service.PermissionService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PermissionServiceImpl implements PermissionService {
    private final PermissionMapper permissionMapper;

    public PermissionServiceImpl(PermissionMapper permissionMapper) {
        this.permissionMapper = permissionMapper;
    }

    @Override
    public List<Permission> getAllPermissions() {
        return permissionMapper.findAll();
    }
}
