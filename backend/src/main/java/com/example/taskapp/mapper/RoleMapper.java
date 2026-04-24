package com.example.taskapp.mapper;

import com.example.taskapp.model.Role;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface RoleMapper {
    List<Role> findAll();
    Role findById(Integer id);
    Role findByName(String name);
    void insert(Role role);
    void update(Role role);
    void delete(Integer id);
    List<Role> findByUserId(Integer userId);
    
    void addPermissionToRole(@Param("roleId") Integer roleId, 
                             @Param("permissionId") Integer permissionId,
                             @Param("createdBy") String createdBy,
                             @Param("createdDate") LocalDateTime createdDate,
                             @Param("updatedBy") String updatedBy,
                             @Param("updatedDate") LocalDateTime updatedDate);
    void removePermissionFromRole(@Param("roleId") Integer roleId, @Param("permissionId") Integer permissionId);
    void removeAllPermissionsFromRole(Integer roleId);
}
