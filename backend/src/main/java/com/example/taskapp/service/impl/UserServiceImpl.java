package com.example.taskapp.service.impl;

import com.example.taskapp.core.interceptor.PageContext;
import com.example.taskapp.mapper.RoleMapper;
import com.example.taskapp.mapper.UserMapper;
import com.example.taskapp.core.dto.PageResponse;
import com.example.taskapp.core.dto.FilterPaging;
import com.example.taskapp.core.dto.PageRequest;
import com.example.taskapp.core.dto.Pagination;
import com.example.taskapp.model.Role;
import com.example.taskapp.model.User;
import com.example.taskapp.service.UserService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.taskapp.core.util.PaginationUtils;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    private final UserMapper userMapper;
    private final RoleMapper roleMapper;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserMapper userMapper, RoleMapper roleMapper, PasswordEncoder passwordEncoder) {
        this.userMapper = userMapper;
        this.roleMapper = roleMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<User> getAllUsers() {
        return userMapper.findAll(null, null, null, null, null);
    }

    @Override
    public PageResponse<User> getPagedUsers(FilterPaging<PageRequest> request, Pagination pagination) {
        var search = request.getFilter() != null ? request.getFilter().getSearch() : null;
        return PaginationUtils.execute(pagination, (size, offset, sortBy, sortDirection) -> userMapper.findAll(size, offset, search, sortBy, sortDirection));
    }

    @Override
    public User getUserById(Integer id) {
        return userMapper.findById(id);
    }

    @Override
    @Transactional
    public void createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        var currentUser = getCurrentUser();
        var now = LocalDateTime.now();
        user.setCreatedBy(currentUser);
        user.setCreatedDate(now);
        userMapper.insert(user);
        
        if (user.getRoles() != null) {
            for (var role : user.getRoles()) {
                var existingRole = roleMapper.findByName(role.getName());
                if (existingRole != null) {
                    userMapper.addRoleToUser(user.getId(), existingRole.getId(), currentUser, now, null, null);
                }
            }
        }
    }

    @Override
    @Transactional
    public void updateUser(User user) {
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        var currentUser = getCurrentUser();
        var now = LocalDateTime.now();
        user.setUpdatedBy(currentUser);
        user.setUpdatedDate(now);
        userMapper.update(user);
        
        userMapper.removeAllRolesFromUser(user.getId());
        if (user.getRoles() != null) {
            for (var role : user.getRoles()) {
                var existingRole = roleMapper.findByName(role.getName());
                if (existingRole != null) {
                    userMapper.addRoleToUser(user.getId(), existingRole.getId(), currentUser, now, currentUser, now);
                }
            }
        }
    }

    @Override
    public void deleteUser(Integer id) {
        userMapper.delete(id);
    }

    @Override
    @Transactional
    public void addRoleToUser(Integer userId, Integer roleId) {
        var currentUser = getCurrentUser();
        var now = LocalDateTime.now();
        userMapper.addRoleToUser(userId, roleId, currentUser, now, null, null);
    }

    @Override
    @Transactional
    public void removeRoleFromUser(Integer userId, Integer roleId) {
        userMapper.removeRoleFromUser(userId, roleId);
    }

    @Override
    @Transactional
    public void changePassword(String username, String newPassword) {
        var user = userMapper.findByUsername(username);
        if (user != null) {
            var currentUser = getCurrentUser();
            var now = LocalDateTime.now();
            userMapper.updatePassword(user.getId(), 
                                    passwordEncoder.encode(newPassword), 
                                    currentUser, 
                                    now);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    @Override
    public User getUserByUsername(String username) {
        return userMapper.findByUsername(username);
    }

    private String getCurrentUser() {
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            return "SYSTEM";
        }
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
