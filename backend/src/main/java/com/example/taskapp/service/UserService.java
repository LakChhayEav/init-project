package com.example.taskapp.service;

import com.example.taskapp.mapper.RoleMapper;
import com.example.taskapp.mapper.UserMapper;
import com.example.taskapp.model.PageResponse;
import com.example.taskapp.model.Role;
import com.example.taskapp.model.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class UserService {
    private final UserMapper userMapper;
    private final RoleMapper roleMapper;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserMapper userMapper, RoleMapper roleMapper, PasswordEncoder passwordEncoder) {
        this.userMapper = userMapper;
        this.roleMapper = roleMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userMapper.findAll(null, null, null);
    }

    public PageResponse<User> getPagedUsers(int page, int size, String search) {
        int offset = page * size;
        List<User> content = userMapper.findAll(size, offset, search);
        int total = userMapper.countAll(search);
        return new PageResponse<>(content, total, size, page);
    }

    public User getUserById(Integer id) {
        return userMapper.findById(id);
    }

    @Transactional
    public void createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userMapper.insert(user);
        
        if (user.getRoles() != null) {
            for (Role role : user.getRoles()) {
                Role existingRole = roleMapper.findByName(role.getName());
                if (existingRole != null) {
                    userMapper.addRoleToUser(user.getId(), existingRole.getId());
                }
            }
        }
    }

    @Transactional
    public void updateUser(User user) {
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        userMapper.update(user);
        
        userMapper.removeAllRolesFromUser(user.getId());
        if (user.getRoles() != null) {
            for (Role role : user.getRoles()) {
                Role existingRole = roleMapper.findByName(role.getName());
                if (existingRole != null) {
                    userMapper.addRoleToUser(user.getId(), existingRole.getId());
                }
            }
        }
    }

    public void deleteUser(Integer id) {
        userMapper.delete(id);
    }

    @Transactional
    public void addRoleToUser(Integer userId, Integer roleId) {
        userMapper.addRoleToUser(userId, roleId);
    }

    @Transactional
    public void removeRoleFromUser(Integer userId, Integer roleId) {
        userMapper.removeRoleFromUser(userId, roleId);
    }
}
