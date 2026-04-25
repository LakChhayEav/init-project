package com.example.taskapp.dto;
import java.util.List;

public class LoginResponse {
    private String token;
    private String username;
    private List<String> roles;
    private boolean passwordResetRequired;

    public LoginResponse() {}
    public LoginResponse(String token, String username, List<String> roles, boolean passwordResetRequired) {
        this.token = token;
        this.username = username;
        this.roles = roles;
        this.passwordResetRequired = passwordResetRequired;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public List<String> getRoles() { return roles; }
    public void setRoles(List<String> roles) { this.roles = roles; }
    public boolean isPasswordResetRequired() { return passwordResetRequired; }
    public void setPasswordResetRequired(boolean passwordResetRequired) { this.passwordResetRequired = passwordResetRequired; }
}
