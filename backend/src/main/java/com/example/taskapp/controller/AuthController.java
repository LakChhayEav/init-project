package com.example.taskapp.controller;

import com.example.taskapp.dto.LoginRequest;
import com.example.taskapp.dto.LoginResponse;
import com.example.taskapp.model.User;
import com.example.taskapp.security.JwtTokenProvider;
import com.example.taskapp.service.UserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.example.taskapp.mapper.UserMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4500")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserService userService;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager, 
                          JwtTokenProvider tokenProvider, 
                          UserService userService,
                          UserMapper userMapper,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userService = userService;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public LoginResponse authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        
        User user = userMapper.findByUsername(loginRequest.getUsername());
        
        System.out.println("DEBUG: User " + user.getUsername() + " reset required: " + user.isPasswordResetRequired());
        
        List<String> roles = authentication.getAuthorities().stream()
                .map(authority -> authority.getAuthority())
                .filter(authority -> authority.startsWith("ROLE_"))
                .map(authority -> authority.replace("ROLE_", ""))
                .collect(Collectors.toList());
        return new LoginResponse(jwt, loginRequest.getUsername(), roles, user.isPasswordResetRequired());
    }

    @PostMapping("/change-password")
    public Map<String, String> changePassword(@RequestBody Map<String, String> request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        String newPassword = request.get("newPassword");
        
        User user = userMapper.findByUsername(username);
        if (user != null) {
            userMapper.updatePassword(user.getId(), passwordEncoder.encode(newPassword));
            return Map.of("message", "Password updated successfully");
        }
        throw new RuntimeException("User not found");
    }

}
