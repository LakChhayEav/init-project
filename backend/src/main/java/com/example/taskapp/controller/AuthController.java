package com.example.taskapp.controller;

import com.example.taskapp.dto.LoginRequest;
import com.example.taskapp.dto.LoginResponse;
import com.example.taskapp.model.User;
import com.example.taskapp.security.JwtTokenProvider;
import com.example.taskapp.service.UserService;
import com.example.taskapp.core.util.ResponseUtils;
import com.example.taskapp.config.Api;
import com.example.taskapp.config.ApiDocs;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
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
    @Operation(operationId = "Auth", summary = "User Login", description = "Authenticate user credentials and generate a JWT token.")
    @ApiResponse(
            responseCode = "200",
            description = "ok",
            content = @Content(
                    mediaType = "application/json",
                    examples = @ExampleObject(name = Api.CodeMessage.ok)
            )
    )
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        var authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        var jwt = tokenProvider.generateToken(authentication);
        var user = userService.getUserByUsername(loginRequest.getUsername());
        
        var roles = authentication.getAuthorities().stream()
                .map(authority -> authority.getAuthority())
                .filter(authority -> authority.startsWith("ROLE_"))
                .map(authority -> authority.replace("ROLE_", ""))
                .collect(Collectors.toList());
        return ResponseUtils.ok(new LoginResponse(jwt, loginRequest.getUsername(), roles, user.isPasswordResetRequired()));
    }

    @PostMapping("/change-password")
    @Operation(operationId = "Auth", summary = "Change Password", description = "Update the password for the currently authenticated user.")
    @ApiResponse(
            responseCode = "200",
            description = "ok",
            content = @Content(
                    mediaType = "application/json",
                    examples = @ExampleObject(name = Api.CodeMessage.ok)
            )
    )
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {
        var username = SecurityContextHolder.getContext().getAuthentication().getName();
        var newPassword = request.get("newPassword");
        
        userService.changePassword(username, newPassword);
        return ResponseUtils.success("Password updated successfully");
    }

}
