package com.example.taskapp.service;

import com.example.taskapp.core.dto.PageResponse;
import com.example.taskapp.core.dto.FilterPaging;
import com.example.taskapp.core.dto.Pagination;
import com.example.taskapp.core.dto.PageRequest;
import com.example.taskapp.model.User;
import java.util.List;

public interface UserService {
    List<User> getAllUsers();
    
    PageResponse<User> getPagedUsers(FilterPaging<PageRequest> request, Pagination pagination);
    
    User getUserById(Integer id);
    
    void createUser(User user);
    
    void updateUser(User user);
    
    void deleteUser(Integer id);
    
    void addRoleToUser(Integer userId, Integer roleId);
    
    void removeRoleFromUser(Integer userId, Integer roleId);
    
    void changePassword(String username, String newPassword);
    
    User getUserByUsername(String username);
}
