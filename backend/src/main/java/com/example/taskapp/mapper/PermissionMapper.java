package com.example.taskapp.mapper;

import com.example.taskapp.model.Permission;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface PermissionMapper {
    List<Permission> findAll();
    Permission findById(Integer id);
    void insert(Permission permission);
    void update(Permission permission);
    void delete(Integer id);
    List<Permission> findByRoleId(Integer roleId);
}
