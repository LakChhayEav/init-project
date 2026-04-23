package com.example.taskapp.mapper;

import com.example.taskapp.model.Role;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface RoleMapper {
    List<Role> findAll();
    Role findById(Integer id);
    void insert(Role role);
    void update(Role role);
    void delete(Integer id);
    List<Role> findByUserId(Integer userId);
    
    void addPermissionToRole(@Param("roleId") Integer roleId, @Param("permissionId") Integer permissionId);
    void removePermissionFromRole(@Param("roleId") Integer roleId, @Param("permissionId") Integer permissionId);
}
