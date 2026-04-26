package com.example.taskapp.mapper;

import com.example.taskapp.model.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface UserMapper {
    List<User> findAll(@Param("limit") Integer limit, @Param("offset") Integer offset, @Param("search") String search);
    int countAll(@Param("search") String search);
    User findById(Integer id);
    User findByUsername(String username);
    void insert(User user);
    void update(User user);
    void updatePassword(@Param("userId") Integer userId, 
                        @Param("password") String password,
                        @Param("updatedBy") String updatedBy,
                        @Param("updatedDate") LocalDateTime updatedDate);
    void delete(Integer id);
    
    void addRoleToUser(@Param("userId") Integer userId, 
                       @Param("roleId") Integer roleId,
                       @Param("createdBy") String createdBy,
                       @Param("createdDate") LocalDateTime createdDate,
                       @Param("updatedBy") String updatedBy,
                       @Param("updatedDate") LocalDateTime updatedDate);
    void removeRoleFromUser(@Param("userId") Integer userId, @Param("roleId") Integer roleId);
    void removeAllRolesFromUser(Integer userId);
}
