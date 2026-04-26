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

    public AuthController(AuthenticationManager authenticationManager, 
                          JwtTokenProvider tokenProvider, 
                          UserService userService) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userService = userService;
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
        
        User user = userService.getUserByUsername(loginRequest.getUsername());
        
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
        
        userService.changePassword(username, newPassword);
        return Map.of("message", "Password updated successfully");
    }

}
