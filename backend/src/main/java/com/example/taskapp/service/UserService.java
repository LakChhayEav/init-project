package com.example.taskapp.service;

import com.example.taskapp.mapper.UserMapper;
import com.example.taskapp.model.PageResponse;
import com.example.taskapp.model.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class UserService {
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userMapper = userMapper;
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

    public void createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userMapper.insert(user);
    }

    public void updateUser(User user) {
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        userMapper.update(user);
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
